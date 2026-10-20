import type { PartnerApplication } from "@/lib/partnerForm";

/**
 * Initial release stores applications in Google Sheets. There is no CRM.
 *
 * Add scripts/PartnerApplications.gs to the Apps Script project that already
 * stores account deletions. scripts/WebApp.gs is the only doPost: partner posts
 * go to the Applications tab, and every other post stays on account deletion.
 * Deploy a second web app from that same project, then set:
 * - GOOGLE_SHEETS_WEBHOOK_URL — the new web app URL
 * - GOOGLE_SHEETS_WEBHOOK_SECRET — same value as the script property WEBHOOK_SECRET
 *
 * The script adds each application as a row with status New, and emails the team.
 */

export const APPLICATION_STATUSES = ["New", "Contacted", "Approved", "Rejected"] as const;

export const SHEET_HEADERS = [
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
] as const;

export type SheetRow = Record<(typeof SHEET_HEADERS)[number], string>;

function cell(value: string | null | undefined): string {
  return value?.trim() ? value.trim() : "";
}

export function toSheetRow(application: PartnerApplication, submittedAt: string): SheetRow {
  return {
    "Submitted at": submittedAt,
    Status: "New",
    "Full name": application.fullName,
    Email: application.email,
    Phone: application.phone,
    Country: application.country,
    "City and state": cell(application.cityState),
    "Business or page": cell(application.businessName),
    "Partner as": application.partnerTypes.join(", "),
    "Deals in": application.categories.join(", "),
    Apps: application.apps.join(", "),
    "Years of experience": application.years,
    Website: cell(application.website),
    Specialties: cell(application.specialties),
    Memberships: cell(application.memberships),
    "Sells today": application.sellToday?.join(", ") ?? "",
    Notes: cell(application.notes),
  };
}

export function sheetsConfigured(): boolean {
  return Boolean(process.env.GOOGLE_SHEETS_WEBHOOK_URL && process.env.GOOGLE_SHEETS_WEBHOOK_SECRET);
}

export async function deliverPartnerApplication(application: PartnerApplication): Promise<void> {
  if (!sheetsConfigured()) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[partner-application:dev] Google Sheets is not configured. Application:", application);
      return;
    }
    throw new Error("Partner form delivery is not configured.");
  }

  const response = await fetch(process.env.GOOGLE_SHEETS_WEBHOOK_URL as string, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      secret: process.env.GOOGLE_SHEETS_WEBHOOK_SECRET,
      row: toSheetRow(application, new Date().toISOString()),
    }),
    redirect: "follow",
  });

  const text = await response.text();
  let body: { ok?: boolean; error?: string } | null = null;
  try {
    body = JSON.parse(text) as { ok?: boolean; error?: string };
  } catch {
    body = null;
  }

  if (!response.ok || body?.ok !== true) {
    throw new Error(`Google Sheets failed (${response.status}): ${(body?.error || text).slice(0, 300)}`);
  }
}
