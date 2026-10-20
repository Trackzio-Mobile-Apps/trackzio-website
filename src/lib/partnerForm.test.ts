import { describe, expect, it } from "vitest";
import { appsForCategories, categoryFromQuery, thanksMessage, validatePartnerApplication, type PartnerApplicationInput } from "@/lib/partnerForm";
import { deliverPartnerApplication, toSheetRow } from "@/lib/partnerDelivery";

const validInput = (): PartnerApplicationInput => ({
  partnerTypes: ["shop", "expert"],
  categories: ["coins", "bullion", "banknotes"],
  fullName: "Mary Cole",
  businessName: "Cole Coins",
  email: "Mary@Example.com",
  phoneCountry: "US",
  phoneNational: "(202) 555-0123",
  country: "United States",
  cityState: "Austin, Texas",
  website: "colecoins.example",
  years: "10–20",
  specialties: "Morgan dollars",
  memberships: "ANA",
  sellToday: ["Physical shop", "eBay"],
  notes: "We also buy collections.",
  consent: true,
});

describe("partner application", () => {
  it("maps app-page categories and ignores unknown values", () => {
    expect(categoryFromQuery("coins")).toBe("coins");
    expect(categoryFromQuery("BANKNOTES")).toBe("banknotes");
    expect(categoryFromQuery("antiques")).toBe("antiques");
    expect(categoryFromQuery("rocks")).toBe("rocks");
    expect(categoryFromQuery("plantezy")).toBeNull();
    expect(categoryFromQuery("")).toBeNull();
  });

  it("maps categories to apps once, and never asks the visitor for an app name", () => {
    expect(appsForCategories(["coins", "bullion", "banknotes", "other"])).toEqual(["Coinzy", "Banknote"]);
    expect(appsForCategories(["rocks", "antiques"])).toEqual(["Antiqzy", "Rockzy"]);
  });

  it("accepts a complete application and normalizes contact details", () => {
    const result = validatePartnerApplication(validInput());
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.application).toMatchObject({
      partnerTypes: ["Shop or dealer", "Expert or appraiser"],
      categories: ["Coins", "Bullion", "Banknotes and paper money"],
      apps: ["Coinzy", "Banknote"],
      firstName: "Mary",
      lastName: "Cole",
      email: "mary@example.com",
      phone: "+12025550123",
      website: "https://colecoins.example/",
      sellToday: ["Physical shop", "eBay"],
    });
    expect(thanksMessage(result.application.firstName)).toBe(
      "Thanks, Mary. We've got your application and will reply within 2 business days.",
    );
  });

  it("drops sell-today answers unless the applicant is a shop or dealer", () => {
    const result = validatePartnerApplication({
      ...validInput(),
      partnerTypes: ["expert"],
      categories: ["rocks"],
      sellToday: ["eBay"],
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.application.sellToday).toBeNull();
    expect(result.application.apps).toEqual(["Rockzy"]);
  });

  it("shows plain errors for a missing email, phone, and consent", () => {
    const result = validatePartnerApplication({
      ...validInput(),
      email: "",
      phoneNational: "123",
      consent: false,
      notes: "x".repeat(501),
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.email).toBe("Please enter your email.");
    expect(result.errors.phone).toBe("Please enter a valid phone number.");
    expect(result.errors.consent).toBe("Please agree so we can contact you about this application.");
    expect(result.errors.notes).toBe("Please keep this to 500 characters.");
  });

  it("stores a new application as a sheet row with status New", () => {
    const result = validatePartnerApplication(validInput());
    if (!result.ok) throw new Error("expected a valid application");
    const row = toSheetRow(result.application, "2026-10-20T00:00:00.000Z");
    expect(row.Status).toBe("New");
    expect(row["Full name"]).toBe("Mary Cole");
    expect(row["Deals in"]).toBe("Coins, Bullion, Banknotes and paper money");
    expect(row.Apps).toBe("Coinzy, Banknote");
    expect(row["Submitted at"]).toBe("2026-10-20T00:00:00.000Z");
  });

  it("rejects an unconfigured production delivery instead of pretending it was sent", async () => {
    const env = process.env as Record<string, string | undefined>;
    const previous = env.NODE_ENV;
    delete process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    delete process.env.GOOGLE_SHEETS_WEBHOOK_SECRET;
    env.NODE_ENV = "production";
    try {
      const result = validatePartnerApplication(validInput());
      if (!result.ok) throw new Error("expected a valid application");
      await expect(deliverPartnerApplication(result.application)).rejects.toThrow(/not configured/);
    } finally {
      env.NODE_ENV = previous;
    }
  });
});
