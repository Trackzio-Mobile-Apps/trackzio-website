import { getCountry, getCountryByName } from "@/lib/countries";

/** Collector apps that have a partner model. Visitors pick categories, not app names. */
export const DEAL_OPTIONS = [
  { id: "coins", label: "Coins", app: "Coinzy" },
  { id: "bullion", label: "Bullion", app: "Coinzy" },
  { id: "banknotes", label: "Banknotes and paper money", app: "Banknote" },
  { id: "antiques", label: "Antiques", app: "Antiqzy" },
  { id: "rocks", label: "Rocks, minerals and gems", app: "Rockzy" },
  { id: "other", label: "Other", app: null },
] as const;

export type DealId = (typeof DEAL_OPTIONS)[number]["id"];

/** Query values used by app pages: /partners?category=coins */
export const CATEGORY_QUERY_TO_DEAL: Record<string, DealId> = {
  coins: "coins",
  banknotes: "banknotes",
  antiques: "antiques",
  rocks: "rocks",
};

/** App page id → category query value. */
export const APP_PARTNER_CATEGORY: Record<string, string> = {
  coinzy: "coins",
  banknotes: "banknotes",
  antiqzy: "antiques",
  rockzy: "rocks",
};

export const PARTNER_TYPES = [
  { id: "shop", label: "Shop or dealer" },
  { id: "expert", label: "Expert or appraiser" },
  { id: "creator", label: "Creator or club" },
  { id: "other", label: "Other" },
] as const;

export type PartnerTypeId = (typeof PARTNER_TYPES)[number]["id"];

export const SELL_TODAY_OPTIONS = [
  "Physical shop",
  "Own website",
  "eBay",
  "Etsy",
  "Whatnot",
  "Shows and fairs",
  "Other",
] as const;

export const EXPERIENCE_OPTIONS = ["Under 2", "2–5", "5–10", "10–20", "20+"] as const;

export const PARTNER_FAQS = [
  {
    q: "Is it free?",
    a: "Listing is free, and so is joining the expert panel.",
  },
  {
    q: "Do you take a commission on sales?",
    a: "We take a small commission based on total sales, and we guarantee it's lower than any competitor's.",
  },
  {
    q: "Which apps will I appear in?",
    a: "The ones that match what you deal in. Tell us your categories in the form and we place you in each fitting app.",
  },
  {
    q: "I deal in more than one category. Do I apply twice?",
    a: "No. Select every category in one form.",
  },
  {
    q: "What happens when you launch a new collector app?",
    a: "Partners in that category hear about it first and can join it before launch.",
  },
  {
    q: "How are experts paid?",
    a: "Per evaluation, at a fixed rate we share on our call.",
  },
  {
    q: "Do I need certifications?",
    a: "No, but tell us about your experience and any memberships (for example ANA, PNG, IBNS, ASA or GIA).",
  },
  {
    q: "Where are your users?",
    a: "Mostly the US and India, with collectors worldwide.",
  },
] as const;

export const NETWORK_APPS = [
  {
    id: "coinzy",
    name: "Coinzy",
    line: "Coins and bullion from around the world",
    partners: "Coin shops, bullion dealers, numismatists",
  },
  {
    id: "banknotes",
    name: "Banknote",
    line: "Banknotes and paper money",
    partners: "Currency dealers, paper money experts",
  },
  {
    id: "antiqzy",
    name: "Antiqzy",
    line: "Antiques and vintage pieces",
    partners: "Antique stores, estate dealers, appraisers",
  },
  {
    id: "rockzy",
    name: "Rockzy",
    line: "Rocks, minerals and gems",
    partners: "Rock and gem shops, mineral dealers, gemologists",
  },
] as const;

export const PARTNER_WAYS = [
  {
    title: "Shops and dealers",
    who: "Coin, currency, antique, rock and gem shops and dealers",
    get: "Free listings in the marketplace of every app that fits what you sell. Buyers contact you directly, with no commission. Leads from collectors near you who want to sell, rolling out app by app.",
  },
  {
    title: "Experts and appraisers",
    who: "Numismatists, paper money specialists, antique appraisers, gemologists",
    get: "Evaluate items for our users and get paid for each evaluation. See interesting pieces first, and make an offer if the owner wants to sell.",
  },
  {
    title: "Creators and clubs",
    who: "Collector YouTubers and pages, coin clubs, rock and gem clubs, antique societies",
    get: "Create content with us, get featured in our apps, and reach new collectors in your hobby.",
  },
] as const;

export const PARTNER_STEPS = [
  {
    title: "Apply once",
    text: "Tell us what you deal in. One form covers every app.",
  },
  {
    title: "Talk to us",
    text: "We'll reply within 2-5 business days and set up a short call.",
  },
  {
    title: "Go live",
    text: "We set up your listings, expert profile or content plan in each app that fits.",
  },
] as const;

/**
 * Shown only after a real partner agrees in writing.
 * Leave null until then. Do not add a placeholder quote.
 */
export const partnerQuote: {
  quote: string;
  name: string;
  business: string;
  city: string;
} | null = null;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const PARTNER_FIELD_LIMITS = {
  fullName: 60,
  businessName: 100,
  email: 254,
  cityState: 80,
  website: 200,
  specialties: 150,
  memberships: 150,
  notes: 500,
  otherDetail: 150,
} as const;

export type PartnerField =
  | "partnerTypes"
  | "categories"
  | "fullName"
  | "email"
  | "phoneCountry"
  | "phone"
  | "country"
  | "website"
  | "years"
  | "businessName"
  | "cityState"
  | "specialties"
  | "memberships"
  | "notes"
  | "partnerTypeOther"
  | "categoryOther"
  | "sellTodayOther"
  | "consent";

export type PartnerFieldErrors = Partial<Record<PartnerField, string>>;

export type PartnerApplicationInput = {
  partnerTypes: string[];
  categories: string[];
  fullName: string;
  businessName: string;
  email: string;
  phoneCountry: string;
  phoneNational: string;
  country: string;
  cityState: string;
  website: string;
  years: string;
  specialties: string;
  memberships: string;
  sellToday: string[];
  notes: string;
  partnerTypeOther: string;
  categoryOther: string;
  sellTodayOther: string;
  consent: boolean;
  /** Honeypot. Must stay empty. */
  fax?: string;
};

export type PartnerApplication = {
  partnerTypes: string[];
  categories: string[];
  apps: string[];
  fullName: string;
  firstName: string;
  lastName: string;
  businessName: string | null;
  email: string;
  phone: string;
  country: string;
  cityState: string | null;
  website: string | null;
  years: string;
  specialties: string | null;
  memberships: string | null;
  sellToday: string[] | null;
  notes: string | null;
};

export function categoryFromQuery(value: string | null | undefined): DealId | null {
  if (!value) return null;
  return CATEGORY_QUERY_TO_DEAL[value.trim().toLowerCase()] ?? null;
}

export function appsForCategories(categories: string[]): string[] {
  const apps: string[] = [];
  for (const option of DEAL_OPTIONS) {
    if (!categories.includes(option.id) || !option.app) continue;
    if (!apps.includes(option.app)) apps.push(option.app);
  }
  return apps;
}

export function firstNameFrom(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] ?? "";
}

function clean(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function otherChoice(detail: string): string {
  return `Other: ${clean(detail)}`;
}

function checkOtherDetail(selected: boolean, detail: string, emptyMessage: string): string | undefined {
  if (!selected) return undefined;
  const text = clean(detail);
  if (!text) return emptyMessage;
  if (text.length > PARTNER_FIELD_LIMITS.otherDetail) return "Please keep this to 150 characters.";
  return undefined;
}

function normalizeWebsite(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const url = new URL(withProtocol);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    if (!url.hostname.includes(".")) return null;
    return url.toString();
  } catch {
    return null;
  }
}

function toE164(countryCode: string, national: string): string | null {
  const country = getCountry(countryCode);
  if (!country) return null;
  const digits = national.replace(/[^\d]/g, "").replace(/^0+/, "");
  if (!digits) return null;
  const e164 = `+${country.dial}${digits}`;
  const totalDigits = e164.slice(1).length;
  if (totalDigits < 8 || totalDigits > 15) return null;
  if (digits.length < 6 || digits.length > 14) return null;
  return e164;
}

export function validatePartnerApplication(
  input: PartnerApplicationInput,
): { ok: true; application: PartnerApplication } | { ok: false; errors: PartnerFieldErrors } {
  const errors: PartnerFieldErrors = {};

  const partnerTypeOther = clean(input.partnerTypeOther);
  const categoryOther = clean(input.categoryOther);
  const sellTodayOther = clean(input.sellTodayOther);
  const wantsOtherPartner = input.partnerTypes.includes("other");
  const dealsInOther = input.categories.includes("other");
  const sellsSomewhereElse = input.partnerTypes.includes("shop") && input.sellToday.includes("Other");

  const partnerTypes = PARTNER_TYPES.filter((type) => input.partnerTypes.includes(type.id)).map((type) =>
    type.id === "other" && partnerTypeOther ? otherChoice(partnerTypeOther) : type.label,
  );
  if (input.partnerTypes.length === 0 || partnerTypes.length !== input.partnerTypes.length) {
    errors.partnerTypes = "Please choose how you want to partner.";
  }
  const partnerTypeOtherError = checkOtherDetail(
    wantsOtherPartner,
    input.partnerTypeOther,
    "Please tell us how you want to partner.",
  );
  if (partnerTypeOtherError) errors.partnerTypeOther = partnerTypeOtherError;

  const categories = DEAL_OPTIONS.filter((deal) => input.categories.includes(deal.id)).map((deal) =>
    deal.id === "other" && categoryOther ? otherChoice(categoryOther) : deal.label,
  );
  if (input.categories.length === 0 || categories.length !== input.categories.length) {
    errors.categories = "Please choose what you deal in.";
  }
  const categoryOtherError = checkOtherDetail(dealsInOther, input.categoryOther, "Please tell us what else you deal in.");
  if (categoryOtherError) errors.categoryOther = categoryOtherError;

  const sellTodayOtherError = checkOtherDetail(
    sellsSomewhereElse,
    input.sellTodayOther,
    "Please tell us where else you sell.",
  );
  if (sellTodayOtherError) errors.sellTodayOther = sellTodayOtherError;

  const fullName = clean(input.fullName);
  if (fullName.length < 2) {
    errors.fullName = "Please enter your full name.";
  } else if (fullName.length > PARTNER_FIELD_LIMITS.fullName) {
    errors.fullName = "Please enter a shorter name.";
  }

  const email = input.email.trim().toLowerCase();
  if (!email) {
    errors.email = "Please enter your email.";
  } else if (email.length > PARTNER_FIELD_LIMITS.email || !EMAIL_PATTERN.test(email)) {
    errors.email = "Please enter a valid email.";
  }

  const phoneCountry = input.phoneCountry.trim().toUpperCase();
  if (!phoneCountry || !getCountry(phoneCountry)) {
    errors.phoneCountry = "Please choose a country code.";
  }

  const phoneDigits = input.phoneNational.trim();
  if (!phoneDigits) {
    errors.phone = "Please enter your phone number.";
  } else if (phoneCountry && getCountry(phoneCountry) && !toE164(phoneCountry, phoneDigits)) {
    errors.phone = "Please enter a valid phone number.";
  }

  const countryName = input.country.trim();
  if (!countryName || !getCountryByName(countryName)) {
    errors.country = "Please choose your country.";
  }

  const websiteRaw = input.website.trim();
  const website = websiteRaw ? normalizeWebsite(websiteRaw) : null;
  if (websiteRaw.length > PARTNER_FIELD_LIMITS.website) {
    errors.website = "Please enter a shorter link.";
  } else if (websiteRaw && !website) {
    errors.website = "Please enter a valid link.";
  }

  if (!EXPERIENCE_OPTIONS.includes(input.years as (typeof EXPERIENCE_OPTIONS)[number])) {
    errors.years = "Please choose your years of experience.";
  }

  const businessName = clean(input.businessName);
  if (businessName.length > PARTNER_FIELD_LIMITS.businessName) {
    errors.businessName = "Please enter a shorter business or page name.";
  }

  const cityState = clean(input.cityState);
  if (cityState.length > PARTNER_FIELD_LIMITS.cityState) {
    errors.cityState = "Please enter a shorter city and state.";
  }

  const specialties = clean(input.specialties);
  if (specialties.length > PARTNER_FIELD_LIMITS.specialties) {
    errors.specialties = "Please keep specialties to 150 characters.";
  }

  const memberships = clean(input.memberships);
  if (memberships.length > PARTNER_FIELD_LIMITS.memberships) {
    errors.memberships = "Please keep memberships to 150 characters.";
  }

  const notes = input.notes.trim();
  if (notes.length > PARTNER_FIELD_LIMITS.notes) {
    errors.notes = "Please keep this to 500 characters.";
  }

  if (!input.consent) {
    errors.consent = "Please agree so we can contact you about this application.";
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  const phone = toE164(phoneCountry, phoneDigits);
  if (!phone) {
    return { ok: false, errors: { phone: "Please enter a valid phone number." } };
  }

  const isShop = input.partnerTypes.includes("shop");
  const sellToday = isShop
    ? SELL_TODAY_OPTIONS.filter((option) => input.sellToday.includes(option)).map((option) =>
        option === "Other" && sellTodayOther ? otherChoice(sellTodayOther) : option,
      )
    : [];

  const nameParts = fullName.split(" ");

  return {
    ok: true,
    application: {
      partnerTypes,
      categories,
      apps: appsForCategories(input.categories),
      fullName,
      firstName: nameParts[0],
      lastName: nameParts.slice(1).join(" "),
      businessName: businessName || null,
      email,
      phone,
      country: countryName,
      cityState: cityState || null,
      website,
      years: input.years,
      specialties: specialties || null,
      memberships: memberships || null,
      sellToday: isShop && sellToday.length > 0 ? sellToday : null,
      notes: notes || null,
    },
  };
}

export function thanksMessage(firstName: string): string {
  return `Thanks, ${firstName}. We've got your application and will reply within 2-5 business days.`;
}

export const PARTNER_SENT_TOAST = "Application sent. We'll reply within 2 business days.";
export const PARTNER_SEND_FAILED_TOAST = "Couldn't send. Please try again.";
