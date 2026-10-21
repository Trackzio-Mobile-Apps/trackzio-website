/**
 * Partner applications → spreadsheet 14UhLDbWGIZSJIOcGAzSuAK17YkOBa0Rl6xIflY42YL0.
 * This is not the account-deletion spreadsheet. Share only this file with the
 * service account. The first submission creates a "Partner applications" tab.
 *
 * Deploy this file as an AWS Lambda (Node.js 18 or 20). Handler: index.handler
 * Give it a public Function URL with CORS enabled.
 * Put that URL in NEXT_PUBLIC_PARTNER_APPLICATION_ENDPOINT.
 *
 * Lambda environment variables:
 *   GOOGLE_SERVICE_ACCOUNT_JSON — the service account key JSON
 *   RECAPTCHA_SECRET — secret key for the same reCAPTCHA entry as the site key
 */

const crypto = require("crypto");

const SHEET_NAME = "Partner applications";
const PARTNER_SPREADSHEET_ID = "14UhLDbWGIZSJIOcGAzSuAK17YkOBa0Rl6xIflY42YL0";
const HEADERS = [
  "Submitted at",
  "Status",
  "Full name",
  "Email",
  "Phone",
  "Country",
  "City and state",
  "Business or page",
  "Partner as",
  "Deals in",
  "Apps",
  "Years of experience",
  "Website",
  "Specialties",
  "Memberships",
  "Sells today",
  "Notes",
];

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function respond(statusCode, payload) {
  return {
    statusCode,
    headers: { ...CORS, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  };
}

function methodOf(event) {
  return event?.requestContext?.http?.method || event?.httpMethod || "";
}

function readBody(event) {
  if (!event || event.body == null || event.body === "") return {};
  const raw = event.isBase64Encoded ? Buffer.from(event.body, "base64").toString("utf8") : event.body;
  if (typeof raw === "object") return raw;
  return JSON.parse(raw);
}

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}

function list(value) {
  if (!Array.isArray(value)) return "";
  return value
    .filter((item) => typeof item === "string" && item.trim())
    .map((item) => item.trim())
    .join(", ");
}

function loadServiceAccount() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw || !raw.trim()) {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON is not set.");
  }
  const account = JSON.parse(raw);
  if (typeof account.private_key === "string") {
    account.private_key = account.private_key.replace(/\\n/g, "\n");
  }
  if (!account.client_email || !account.private_key) {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON is missing client_email or private_key.");
  }
  return account;
}

async function googleAccessToken(account) {
  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: "RS256", typ: "JWT" })).toString("base64url");
  const claim = Buffer.from(
    JSON.stringify({
      iss: account.client_email,
      scope: "https://www.googleapis.com/auth/spreadsheets",
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    }),
  ).toString("base64url");
  const unsigned = `${header}.${claim}`;
  const signature = crypto.createSign("RSA-SHA256").update(unsigned).sign(account.private_key, "base64url");

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${unsigned}.${signature}`,
    }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.access_token) {
    throw new Error(data.error_description || data.error || "Google authorization failed.");
  }
  return data.access_token;
}

async function sheetsRequest(token, spreadsheetId, path, options = {}) {
  const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}${path}`, {
    method: options.method || "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: options.body == null ? undefined : JSON.stringify(options.body),
  });
  const textBody = await response.text();
  let data = {};
  if (textBody) {
    try {
      data = JSON.parse(textBody);
    } catch {
      data = { message: textBody };
    }
  }
  if (!response.ok) {
    const error = new Error(data?.error?.message || data.message || `Google Sheets failed (${response.status})`);
    error.status = response.status;
    throw error;
  }
  return data;
}

function valuesPath(range, suffix = "") {
  return `/values/${encodeURIComponent(range)}${suffix}`;
}

async function appendApplication(token, spreadsheetId, row) {
  let header;
  try {
    header = await sheetsRequest(token, spreadsheetId, valuesPath(`${SHEET_NAME}!A1:P1`));
  } catch (error) {
    if (!String(error.message).toLowerCase().includes("unable to parse range")) throw error;
    await sheetsRequest(token, spreadsheetId, ":batchUpdate", {
      method: "POST",
      body: { requests: [{ addSheet: { properties: { title: SHEET_NAME } } }] },
    });
    header = {};
  }

  if (!header.values || header.values.length === 0) {
    await sheetsRequest(token, spreadsheetId, `${valuesPath(`${SHEET_NAME}!A1`)}?valueInputOption=RAW`, {
      method: "PUT",
      body: { values: [HEADERS] },
    });
  }

  await sheetsRequest(
    token,
    spreadsheetId,
    `${valuesPath(`${SHEET_NAME}!A1`)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    { method: "POST", body: { values: [row] } },
  );
}

async function verifyRecaptcha(token) {
  const secret = text(process.env.RECAPTCHA_SECRET);
  if (!secret) {
    throw new Error("RECAPTCHA_SECRET is not set.");
  }
  if (!token) return false;
  const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ secret, response: token }),
  });
  const data = await response.json().catch(() => ({}));
  return Boolean(response.ok && data.success);
}

function submittedAt() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const value = (type) => parts.find((part) => part.type === type)?.value || "";
  return `${value("year")}-${value("month")}-${value("day")} ${value("hour")}:${value("minute")}:${value("second")} IST`;
}

function applicationRow(body) {
  const errors = {};
  const fullName = text(body.fullName);
  const email = text(body.email).toLowerCase();
  const phone = text(body.phone);
  const country = text(body.country);
  const years = text(body.years);
  const partnerTypes = list(body.partnerTypes);
  const categories = list(body.categories);

  if (fullName.length < 2) errors.fullName = "Please enter your full name.";
  if (!email || !EMAIL_PATTERN.test(email)) errors.email = "Please enter a valid email.";
  if (!phone) errors.phone = "Please enter your phone number.";
  if (!country) errors.country = "Please choose your country.";
  if (!years) errors.years = "Please choose your years of experience.";
  if (!partnerTypes) errors.partnerTypes = "Please choose how you want to partner.";
  if (!categories) errors.categories = "Please choose what you deal in.";
  if (body.consent !== true) errors.consent = "Please agree so we can contact you about this application.";

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    firstName: fullName.split(/\s+/)[0],
    row: [
      submittedAt(),
      "New",
      fullName,
      email,
      phone,
      country,
      text(body.cityState),
      text(body.businessName),
      partnerTypes,
      categories,
      list(body.apps),
      years,
      text(body.website),
      text(body.specialties),
      text(body.memberships),
      list(body.sellToday),
      text(body.notes),
    ],
  };
}

exports.handler = async (event) => {
  const method = methodOf(event).toUpperCase();
  if (method === "OPTIONS") {
    return { statusCode: 200, headers: CORS, body: "" };
  }
  if (method !== "POST") {
    return respond(405, { error: "Please use the application form." });
  }

  let body;
  try {
    body = readBody(event);
  } catch {
    return respond(400, { error: "Please check the form and try again." });
  }

  if (text(body.fax)) {
    return respond(200, { ok: true, firstName: text(body.fullName).split(/\s+/)[0] || "there" });
  }

  const application = applicationRow(body);
  if (!application.ok) {
    return respond(400, { error: "Please check the form and try again.", errors: application.errors });
  }

  const captchaToken = text(body.recaptchaToken) || text(body.recaptchaResponse);
  try {
    const passed = await verifyRecaptcha(captchaToken);
    if (!passed) {
      return respond(400, { error: "Please complete the verification and try again." });
    }
  } catch {
    return respond(503, { error: "We couldn't save your application. Please try again." });
  }

  const spreadsheetId = text(process.env.SPREADSHEET_ID) || PARTNER_SPREADSHEET_ID;

  try {
    const account = loadServiceAccount();
    const token = await googleAccessToken(account);
    await appendApplication(token, spreadsheetId, application.row);
  } catch {
    return respond(503, { error: "We couldn't save your application. Please try again." });
  }

  return respond(200, { ok: true, firstName: application.firstName });
};
