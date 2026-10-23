import { describe, expect, it } from "vitest";
import { appsForCategories, categoryFromQuery, PARTNER_FIELD_LIMITS, thanksMessage, validatePartnerApplication, type PartnerApplicationInput } from "@/lib/partnerForm";
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
  partnerTypeOther: "",
  categoryOther: "",
  sellTodayOther: "",
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

  it("rejects fields that are longer than the limit", () => {
    const result = validatePartnerApplication({
      ...validInput(),
      fullName: "M".repeat(PARTNER_FIELD_LIMITS.fullName + 1),
      businessName: "B".repeat(PARTNER_FIELD_LIMITS.businessName + 1),
      cityState: "C".repeat(PARTNER_FIELD_LIMITS.cityState + 1),
      website: `${"w".repeat(PARTNER_FIELD_LIMITS.website)}.example`,
      specialties: "S".repeat(PARTNER_FIELD_LIMITS.specialties + 1),
      memberships: "M".repeat(PARTNER_FIELD_LIMITS.memberships + 1),
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.fullName).toBe("Please enter a shorter name.");
    expect(result.errors.businessName).toBe("Please enter a shorter business or page name.");
    expect(result.errors.cityState).toBe("Please enter a shorter city and state.");
    expect(result.errors.website).toBe("Please enter a shorter link.");
    expect(result.errors.specialties).toBe("Please keep specialties to 150 characters.");
    expect(result.errors.memberships).toBe("Please keep memberships to 150 characters.");
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

  it("asks for an explanation when Other is selected and stores that text with the choice", () => {
    const missing = validatePartnerApplication({
      ...validInput(),
      partnerTypes: ["shop", "other"],
      categories: ["coins", "other"],
      sellToday: ["eBay", "Other"],
    });
    expect(missing.ok).toBe(false);
    if (missing.ok) return;
    expect(missing.errors.partnerTypeOther).toBe("Please tell us how you want to partner.");
    expect(missing.errors.categoryOther).toBe("Please tell us what else you deal in.");
    expect(missing.errors.sellTodayOther).toBe("Please tell us where else you sell.");

    const saved = validatePartnerApplication({
      ...validInput(),
      partnerTypes: ["shop", "other"],
      partnerTypeOther: "  Auction house  ",
      categories: ["coins", "other"],
      categoryOther: "Trading cards",
      sellToday: ["eBay", "Other"],
      sellTodayOther: "Instagram",
    });
    expect(saved.ok).toBe(true);
    if (!saved.ok) return;
    expect(saved.application.partnerTypes).toEqual(["Shop or dealer", "Other: Auction house"]);
    expect(saved.application.categories).toEqual(["Coins", "Other: Trading cards"]);
    expect(saved.application.sellToday).toEqual(["eBay", "Other: Instagram"]);

    const unused = validatePartnerApplication({
      ...validInput(),
      partnerTypeOther: "Auction house",
      categoryOther: "Trading cards",
      sellTodayOther: "Instagram",
    });
    expect(unused.ok).toBe(true);
    if (!unused.ok) return;
    expect(unused.application.partnerTypes).toEqual(["Shop or dealer", "Expert or appraiser"]);
    expect(unused.application.categories).toEqual(["Coins", "Bullion", "Banknotes and paper money"]);
    expect(unused.application.sellToday).toEqual(["Physical shop", "eBay"]);
  });

  it("stores a new application as a sheet row with status New", () => {
    const result = validatePartnerApplication(validInput());
    if (!result.ok) throw new Error("expected a valid application");
    const row = toSheetRow(result.application, "2026-10-20T00:00:00.000Z");
    expect(row.Status).toBe("New");
    expect(row["Full name"]).toBe("Mary Cole");
    expect(row["Partner as"]).toBe("Shop or dealer, Expert or appraiser");
    expect(row["Deals in"]).toBe("Coins, Bullion, Banknotes and paper money");
    expect(row["Sells today"]).toBe("Physical shop, eBay");
    expect(row.Apps).toBe("Coinzy, Banknote");
    expect(row["Submitted at"]).toBe("2026-10-20T00:00:00.000Z");
  });

  it("accepts several real applications and rejects bad contact details", () => {
    const people = [
      {
        ...validInput(),
        fullName: "  Anita   Shah  ",
        email: "Anita.Shah@Shop.example",
        phoneCountry: "in",
        phoneNational: "098765 43210",
        country: "India",
        cityState: "Ahmedabad, Gujarat",
        website: "instagram.com/anitacoins",
        years: "20+",
        partnerTypes: ["shop", "creator", "other"],
        partnerTypeOther: "Stamp club",
        categories: ["coins", "bullion", "antiques", "rocks", "other"],
        categoryOther: "Trading cards",
        sellToday: ["Physical shop", "Whatnot", "Not a channel"],
      },
      {
        ...validInput(),
        fullName: "Jean-Luc",
        businessName: "",
        email: "jean@atelier.fr",
        phoneCountry: "FR",
        phoneNational: "06 12 34 56 78",
        country: "France",
        cityState: "",
        website: "https://atelier.example/shop",
        years: "Under 2",
        partnerTypes: ["expert"],
        categories: ["other"],
        categoryOther: "Vintage posters",
        sellToday: ["eBay"],
        specialties: "",
        memberships: "",
        notes: "",
      },
    ];

    const india = validatePartnerApplication(people[0]);
    expect(india.ok).toBe(true);
    if (!india.ok) return;
    expect(india.application).toMatchObject({
      fullName: "Anita Shah",
      firstName: "Anita",
      lastName: "Shah",
      email: "anita.shah@shop.example",
      phone: "+919876543210",
      website: "https://instagram.com/anitacoins",
      partnerTypes: ["Shop or dealer", "Creator or club", "Other: Stamp club"],
      categories: ["Coins", "Bullion", "Antiques", "Rocks, minerals and gems", "Other: Trading cards"],
      apps: ["Coinzy", "Antiqzy", "Rockzy"],
      sellToday: ["Physical shop", "Whatnot"],
    });

    const france = validatePartnerApplication(people[1]);
    expect(france.ok).toBe(true);
    if (!france.ok) return;
    expect(france.application).toMatchObject({
      firstName: "Jean-Luc",
      lastName: "",
      phone: "+33612345678",
      businessName: null,
      cityState: null,
      website: "https://atelier.example/shop",
      apps: [],
      sellToday: null,
      notes: null,
    });

    const rejected = [
      { ...validInput(), email: "mary@" },
      { ...validInput(), email: "mary example.com" },
      { ...validInput(), website: "javascript:alert(1)" },
      { ...validInput(), website: "localhost" },
      { ...validInput(), phoneNational: "12345" },
      { ...validInput(), phoneNational: "abc" },
      { ...validInput(), phoneCountry: "ZZ" },
      { ...validInput(), fullName: "   A   " },
      { ...validInput(), fullName: "   " },
      { ...validInput(), country: "Not a country" },
      { ...validInput(), years: "2-5" },
      { ...validInput(), partnerTypes: ["nope"] },
      { ...validInput(), categories: [] },
      { ...validInput(), notes: "n".repeat(500) },
    ];
    expect(validatePartnerApplication(rejected[0]).ok).toBe(false);
    expect(validatePartnerApplication(rejected[1]).ok).toBe(false);
    expect(validatePartnerApplication(rejected[2]).ok).toBe(false);
    expect(validatePartnerApplication(rejected[3]).ok).toBe(false);
    expect(validatePartnerApplication(rejected[4]).ok).toBe(false);
    expect(validatePartnerApplication(rejected[5]).ok).toBe(false);
    expect(validatePartnerApplication(rejected[6]).ok).toBe(false);
    expect(validatePartnerApplication(rejected[7]).ok).toBe(false);
    expect(validatePartnerApplication(rejected[8]).ok).toBe(false);
    expect(validatePartnerApplication(rejected[9]).ok).toBe(false);
    expect(validatePartnerApplication(rejected[10]).ok).toBe(false);
    expect(validatePartnerApplication(rejected[11]).ok).toBe(false);
    expect(validatePartnerApplication(rejected[12]).ok).toBe(false);
    const notesLimit = validatePartnerApplication(rejected[13]);
    expect(notesLimit.ok).toBe(true);

    const exactName = validatePartnerApplication({ ...validInput(), fullName: "M".repeat(60), cityState: "C".repeat(80) });
    expect(exactName.ok).toBe(true);
    const maxLink = `${"w".repeat(188)}.example.com`;
    expect(maxLink).toHaveLength(200);
    const savedLink = validatePartnerApplication({ ...validInput(), website: maxLink });
    expect(savedLink.ok).toBe(true);
    if (!savedLink.ok) return;
    expect(savedLink.application.website?.startsWith("https://")).toBe(true);
    expect((savedLink.application.website ?? "").length).toBeGreaterThan(200);
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
