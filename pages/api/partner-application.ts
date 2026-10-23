import type { NextApiRequest, NextApiResponse } from "next";
import { deliverPartnerApplication } from "@/lib/partnerDelivery";
import {
  firstNameFrom,
  validatePartnerApplication,
  type PartnerApplicationInput,
  type PartnerFieldErrors,
} from "@/lib/partnerForm";

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function toInput(body: unknown): PartnerApplicationInput {
  const record = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  return {
    partnerTypes: asStringArray(record.partnerTypes),
    categories: asStringArray(record.categories),
    fullName: asString(record.fullName),
    businessName: asString(record.businessName),
    email: asString(record.email),
    phoneCountry: asString(record.phoneCountry),
    phoneNational: asString(record.phoneNational),
    country: asString(record.country),
    cityState: asString(record.cityState),
    website: asString(record.website),
    years: asString(record.years),
    specialties: asString(record.specialties),
    memberships: asString(record.memberships),
    sellToday: asStringArray(record.sellToday),
    notes: asString(record.notes),
    partnerTypeOther: asString(record.partnerTypeOther),
    categoryOther: asString(record.categoryOther),
    sellTodayOther: asString(record.sellTodayOther),
    consent: record.consent === true,
    fax: asString(record.fax),
  };
}

type ResponseBody = {
  ok?: boolean;
  firstName?: string;
  error?: string;
  errors?: PartnerFieldErrors;
};

const recentSubmissions = new Map<string, number[]>();
const RATE_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT = 5;
const MIN_FILL_MS = 1500;

function clientIp(req: NextApiRequest): string {
  const forwarded = req.headers["x-forwarded-for"];
  const raw = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  return raw?.split(",")[0]?.trim() || req.socket.remoteAddress || "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (recentSubmissions.get(ip) ?? []).filter((time) => now - time < RATE_WINDOW_MS);
  if (recent.length >= RATE_LIMIT) {
    recentSubmissions.set(ip, recent);
    return true;
  }
  recent.push(now);
  recentSubmissions.set(ip, recent);
  return false;
}

function filledTooFast(body: unknown): boolean {
  const record = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const startedAt = typeof record.startedAt === "number" ? record.startedAt : Number(record.startedAt);
  if (!Number.isFinite(startedAt)) return true;
  const elapsed = Date.now() - startedAt;
  if (elapsed > 24 * 60 * 60 * 1000) return true;
  return elapsed >= 0 && elapsed < MIN_FILL_MS;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseBody>) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ error: "Please use the application form." });
    return;
  }

  const input = toInput(req.body);
  if (input.fax?.trim()) {
    res.status(200).json({ ok: true, firstName: firstNameFrom(input.fullName) || "there" });
    return;
  }

  const result = validatePartnerApplication(input);
  if (!result.ok) {
    res.status(400).json({ error: "Please check the form and try again.", errors: result.errors });
    return;
  }

  if (filledTooFast(req.body)) {
    res.status(400).json({ error: "Please wait a moment and try again." });
    return;
  }

  if (isRateLimited(clientIp(req))) {
    res.status(429).json({ error: "Please wait a little while before sending another application." });
    return;
  }

  try {
    await deliverPartnerApplication(result.application);
  } catch (error) {
    console.error("[partner-application]", error);
    res.status(503).json({ error: "We couldn't save your application. Please try again." });
    return;
  }

  res.status(200).json({ ok: true, firstName: result.application.firstName });
}
