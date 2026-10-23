import type { NextApiRequest, NextApiResponse } from "next";

type LocationResponse = {
  country: string | null;
  city: string | null;
  region: string | null;
};

function headerValue(req: NextApiRequest, name: string): string {
  const value = req.headers[name];
  const raw = Array.isArray(value) ? value[0] : value;
  return typeof raw === "string" ? raw.trim() : "";
}

function decodePlace(value: string): string {
  if (!value) return "";
  try {
    return decodeURIComponent(value.replace(/\+/g, " ")).trim();
  } catch {
    return value.trim();
  }
}

function countryCode(req: NextApiRequest): string | null {
  const raw =
    headerValue(req, "x-visitor-country") ||
    headerValue(req, "x-vercel-ip-country") ||
    headerValue(req, "cf-ipcountry") ||
    headerValue(req, "x-country") ||
    headerValue(req, "x-nf-country");
  return /^[A-Za-z]{2}$/.test(raw) ? raw.toUpperCase() : null;
}

function place(req: NextApiRequest, names: string[]): string | null {
  for (const name of names) {
    const value = decodePlace(headerValue(req, name));
    if (value && value.toLowerCase() !== "unknown") return value;
  }
  return null;
}

function fromNetlifyGeo(req: NextApiRequest): LocationResponse | null {
  const raw = headerValue(req, "x-nf-geo");
  if (!raw) return null;
  try {
    const parsed = JSON.parse(Buffer.from(raw, "base64").toString("utf8")) as {
      city?: string;
      country?: { code?: string } | string;
      subdivision?: { name?: string; code?: string };
      region?: string;
    };
    const countryValue = typeof parsed.country === "string" ? parsed.country : parsed.country?.code;
    const country = countryValue && /^[A-Za-z]{2}$/.test(countryValue) ? countryValue.toUpperCase() : null;
    return {
      country,
      city: parsed.city?.trim() || null,
      region: parsed.subdivision?.name?.trim() || parsed.subdivision?.code?.trim() || parsed.region?.trim() || null,
    };
  } catch {
    return null;
  }
}

export default function handler(req: NextApiRequest, res: NextApiResponse<LocationResponse>) {
  const geo = fromNetlifyGeo(req);
  res.setHeader("Cache-Control", "private, max-age=3600");
  res.status(200).json({
    country: countryCode(req) || geo?.country || null,
    city: place(req, ["x-visitor-city", "x-vercel-ip-city", "x-city", "cf-ipcity"]) || geo?.city || null,
    region:
      place(req, ["x-visitor-region", "x-vercel-ip-country-region", "x-region", "x-subdivision", "cf-region"]) ||
      geo?.region ||
      null,
  });
}
