import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";
import { COUNTRIES, detectBrowserCountry, getCountry } from "@/lib/countries";
import {
  DEAL_OPTIONS,
  EXPERIENCE_OPTIONS,
  PARTNER_TYPES,
  SELL_TODAY_OPTIONS,
  firstNameFrom,
  thanksMessage,
  validatePartnerApplication,
  type PartnerApplicationInput,
  type PartnerField,
  type PartnerFieldErrors,
} from "@/lib/partnerForm";

const PARTNER_API_URL = process.env.NEXT_PUBLIC_PARTNER_APPLICATION_ENDPOINT;

const inputClass = (invalid: boolean) =>
  `w-full h-11 min-h-[44px] rounded-xl border bg-muted px-4 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 sm:text-sm ${
    invalid ? "border-destructive ring-1 ring-destructive/30" : "border-border"
  }`;

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 text-sm text-destructive" role="alert">
      {message}
    </p>
  );
}

const emptyInput = (initialCategory: string): PartnerApplicationInput => ({
  partnerTypes: [],
  categories: initialCategory ? [initialCategory] : [],
  fullName: "",
  businessName: "",
  email: "",
  phoneCountry: "",
  phoneNational: "",
  country: "",
  cityState: "",
  website: "",
  years: "",
  specialties: "",
  memberships: "",
  sellToday: [],
  notes: "",
  consent: false,
  fax: "",
});

export default function PartnerForm({ initialCategory }: { initialCategory: string }) {
  const [form, setForm] = useState<PartnerApplicationInput>(() => emptyInput(initialCategory));
  const [errors, setErrors] = useState<PartnerFieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [firstName, setFirstName] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function detectCountry() {
      let code: string | null = null;
      try {
        const response = await fetch("/api/visitor-country");
        if (response.ok) {
          const data = (await response.json()) as { country?: unknown };
          if (typeof data.country === "string") code = data.country.toUpperCase();
        }
      } catch {
        code = null;
      }
      if (!code || !getCountry(code)) code = detectBrowserCountry();
      const match = code ? getCountry(code) : null;
      if (cancelled || !match) return;
      setForm((current) => ({
        ...current,
        phoneCountry: current.phoneCountry || match.code,
        country: current.country || match.name,
      }));
    }

    void detectCountry();
    return () => {
      cancelled = true;
    };
  }, []);

  const isShop = form.partnerTypes.includes("shop");

  const setField = <K extends keyof PartnerApplicationInput>(key: K, value: PartnerApplicationInput[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    const errorKey: PartnerField | null = key === "phoneNational" ? "phone" : key === "fax" ? null : (key as PartnerField);
    if (errorKey && errors[errorKey]) {
      setErrors((current) => ({ ...current, [errorKey]: undefined }));
    }
  };

  const toggle = (key: "partnerTypes" | "categories" | "sellToday", value: string) => {
    setForm((current) => {
      const selected = current[key];
      const next = selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value];
      const partnerTypes = key === "partnerTypes" ? next : current.partnerTypes;
      return {
        ...current,
        [key]: next,
        sellToday: partnerTypes.includes("shop") ? (key === "sellToday" ? next : current.sellToday) : [],
      };
    });
    const errorKey: PartnerField | undefined = key === "sellToday" ? undefined : key;
    if (errorKey) setErrors((current) => ({ ...current, [errorKey]: undefined }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);
    if (form.fax?.trim()) {
      setFirstName(firstNameFrom(form.fullName) || "there");
      return;
    }
    const result = validatePartnerApplication(form);
    if (!result.ok) {
      setErrors(result.errors);
      setSubmitError("Please check the highlighted fields and try again.");
      trackEvent("partner_application_error", { page_name: "partners", reason: "validation" });
      return;
    }
    if (!PARTNER_API_URL) {
      setSubmitError("Set NEXT_PUBLIC_PARTNER_APPLICATION_ENDPOINT in environment variables.");
      trackEvent("partner_application_error", { page_name: "partners", reason: "save" });
      return;
    }

    const application = result.application;
    setIsSubmitting(true);
    try {
      const response = await fetch(PARTNER_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: application.fullName,
          email: application.email,
          phone: application.phone,
          country: application.country,
          cityState: application.cityState,
          businessName: application.businessName,
          partnerTypes: application.partnerTypes,
          categories: application.categories,
          apps: application.apps,
          years: application.years,
          website: application.website,
          specialties: application.specialties,
          memberships: application.memberships,
          sellToday: application.sellToday,
          notes: application.notes,
          consent: true,
          platform: "web",
        }),
      });
      const body = (await response.json().catch(() => null)) as {
        ok?: boolean;
        firstName?: string;
        error?: string;
        errors?: PartnerFieldErrors;
      } | null;

      if (!response.ok || !body?.ok) {
        if (body?.errors) setErrors(body.errors);
        setSubmitError(body?.error || "We couldn't save your application. Please try again.");
        trackEvent("partner_application_error", { page_name: "partners", reason: "save" });
        return;
      }

      trackEvent("partner_application_submit", {
        page_name: "partners",
        partner_types: result.application.partnerTypes.join(", "),
        apps: result.application.apps.join(", "),
      });
      setFirstName(body.firstName || result.application.firstName);
    } catch {
      setSubmitError("We couldn't save your application. Please try again.");
      trackEvent("partner_application_error", { page_name: "partners", reason: "network" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (firstName) {
    return (
      <p className="type-lead text-foreground" role="status">
        {thanksMessage(firstName)}
      </p>
    );
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit} noValidate>
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="partner-fax">Fax</label>
        <input
          id="partner-fax"
          name="fax"
          tabIndex={-1}
          autoComplete="off"
          value={form.fax ?? ""}
          onChange={(event) => setField("fax", event.target.value)}
        />
      </div>

      <fieldset>
        <legend className="text-sm font-medium text-foreground">
          I want to partner as <span className="text-destructive">*</span>
        </legend>
        <div className="mt-3 grid grid-cols-1 gap-2 min-[480px]:grid-cols-2">
          {PARTNER_TYPES.map((type) => {
            const selected = form.partnerTypes.includes(type.id);
            return (
              <label
                key={type.id}
                className={`flex min-h-11 cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2 text-sm transition-colors ${
                  selected ? "border-primary bg-primary/10 text-foreground" : "border-border bg-background hover:border-primary/40 hover:bg-muted"
                }`}
              >
                <input
                  type="checkbox"
                  className="h-4 w-4 shrink-0 accent-primary"
                  checked={selected}
                  onChange={() => toggle("partnerTypes", type.id)}
                />
                {type.label}
              </label>
            );
          })}
        </div>
        <FieldError id="partner-types-error" message={errors.partnerTypes} />
      </fieldset>

      <fieldset>
        <legend className="text-sm font-medium text-foreground">
          What do you deal in? <span className="text-destructive">*</span>
        </legend>
        <div className="mt-3 grid grid-cols-1 gap-2 min-[480px]:grid-cols-2">
          {DEAL_OPTIONS.map((deal) => {
            const selected = form.categories.includes(deal.id);
            return (
              <label
                key={deal.id}
                className={`flex min-h-11 cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2 text-sm transition-colors ${
                  selected ? "border-primary bg-primary/10 text-foreground" : "border-border bg-background hover:border-primary/40 hover:bg-muted"
                }`}
              >
                <input
                  type="checkbox"
                  className="h-4 w-4 shrink-0 accent-primary"
                  checked={selected}
                  onChange={() => toggle("categories", deal.id)}
                />
                {deal.label}
              </label>
            );
          })}
        </div>
        <FieldError id="partner-categories-error" message={errors.categories} />
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="partner-name" className="mb-1.5 block text-sm font-medium text-foreground">
            Full name <span className="text-destructive">*</span>
          </label>
          <input
            id="partner-name"
            name="name"
            autoComplete="name"
            value={form.fullName}
            onChange={(event) => setField("fullName", event.target.value)}
            aria-invalid={!!errors.fullName}
            aria-describedby={errors.fullName ? "partner-name-error" : undefined}
            className={inputClass(!!errors.fullName)}
          />
          <FieldError id="partner-name-error" message={errors.fullName} />
        </div>
        <div>
          <label htmlFor="partner-business" className="mb-1.5 block text-sm font-medium text-foreground">
            Business or page name
          </label>
          <input
            id="partner-business"
            name="organization"
            autoComplete="organization"
            value={form.businessName}
            onChange={(event) => setField("businessName", event.target.value)}
            aria-invalid={!!errors.businessName}
            aria-describedby={errors.businessName ? "partner-business-error" : undefined}
            className={inputClass(!!errors.businessName)}
          />
          <FieldError id="partner-business-error" message={errors.businessName} />
        </div>
      </div>

      <div>
        <label htmlFor="partner-email" className="mb-1.5 block text-sm font-medium text-foreground">
          Email <span className="text-destructive">*</span>
        </label>
        <input
          id="partner-email"
          type="email"
          name="email"
          autoComplete="email"
          inputMode="email"
          value={form.email}
          onChange={(event) => setField("email", event.target.value)}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "partner-email-error" : undefined}
          className={inputClass(!!errors.email)}
        />
        <FieldError id="partner-email-error" message={errors.email} />
      </div>

      <div>
        <label htmlFor="partner-phone" className="mb-1.5 block text-sm font-medium text-foreground">
          Phone <span className="text-destructive">*</span>
        </label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative w-full sm:w-56 sm:shrink-0">
            <select
              id="partner-phone-country"
              name="phone-country"
              autoComplete="tel-country-code"
              value={form.phoneCountry}
              onChange={(event) => setField("phoneCountry", event.target.value)}
              aria-invalid={!!errors.phoneCountry}
              aria-describedby={errors.phoneCountry ? "partner-phone-country-error" : undefined}
              className={`${inputClass(!!errors.phoneCountry)} appearance-none pr-10`}
            >
              <option value="">Code</option>
              {COUNTRIES.map((country) => (
                <option key={country.code} value={country.code}>
                  +{country.dial} {country.name}
                </option>
              ))}
            </select>
            <ChevronDown aria-hidden className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
          <input
            id="partner-phone"
            type="tel"
            name="tel"
            autoComplete="tel-national"
            inputMode="tel"
            value={form.phoneNational}
            onChange={(event) => setField("phoneNational", event.target.value)}
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "partner-phone-error" : undefined}
            className={inputClass(!!errors.phone)}
          />
        </div>
        <FieldError id="partner-phone-country-error" message={errors.phoneCountry} />
        <FieldError id="partner-phone-error" message={errors.phone} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="partner-country" className="mb-1.5 block text-sm font-medium text-foreground">
            Country <span className="text-destructive">*</span>
          </label>
          <select
            id="partner-country"
            name="country"
            autoComplete="country-name"
            value={form.country}
            onChange={(event) => setField("country", event.target.value)}
            aria-invalid={!!errors.country}
            aria-describedby={errors.country ? "partner-country-error" : undefined}
            className={inputClass(!!errors.country)}
          >
            <option value="">Choose a country</option>
            {COUNTRIES.map((country) => (
              <option key={country.code} value={country.name}>
                {country.name}
              </option>
            ))}
          </select>
          <FieldError id="partner-country-error" message={errors.country} />
        </div>
        <div>
          <label htmlFor="partner-city" className="mb-1.5 block text-sm font-medium text-foreground">
            City and state
          </label>
          <input
            id="partner-city"
            name="city"
            autoComplete="address-level2"
            value={form.cityState}
            onChange={(event) => setField("cityState", event.target.value)}
            aria-invalid={!!errors.cityState}
            aria-describedby={errors.cityState ? "partner-city-error" : undefined}
            className={inputClass(!!errors.cityState)}
          />
          <FieldError id="partner-city-error" message={errors.cityState} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="partner-website" className="mb-1.5 block text-sm font-medium text-foreground">
            Website or social link
          </label>
          <input
            id="partner-website"
            type="url"
            name="url"
            inputMode="url"
            placeholder="Shop site, eBay, Etsy, Whatnot, Instagram or YouTube"
            value={form.website}
            onChange={(event) => setField("website", event.target.value)}
            aria-invalid={!!errors.website}
            aria-describedby={errors.website ? "partner-website-error" : undefined}
            className={inputClass(!!errors.website)}
          />
          <FieldError id="partner-website-error" message={errors.website} />
        </div>
        <div>
          <label htmlFor="partner-years" className="mb-1.5 block text-sm font-medium text-foreground">
            Years of experience <span className="text-destructive">*</span>
          </label>
          <select
            id="partner-years"
            name="years"
            value={form.years}
            onChange={(event) => setField("years", event.target.value)}
            aria-invalid={!!errors.years}
            aria-describedby={errors.years ? "partner-years-error" : undefined}
            className={inputClass(!!errors.years)}
          >
            <option value="">Choose one</option>
            {EXPERIENCE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <FieldError id="partner-years-error" message={errors.years} />
        </div>
      </div>

      <div>
        <label htmlFor="partner-specialties" className="mb-1.5 block text-sm font-medium text-foreground">
          Specialties
        </label>
        <input
          id="partner-specialties"
          name="specialties"
          placeholder="e.g. Morgan dollars, world banknotes, Victorian furniture, quartz and agate"
          value={form.specialties}
          onChange={(event) => setField("specialties", event.target.value)}
          aria-invalid={!!errors.specialties}
          aria-describedby={errors.specialties ? "partner-specialties-error" : undefined}
          className={inputClass(!!errors.specialties)}
        />
        <FieldError id="partner-specialties-error" message={errors.specialties} />
      </div>

      <div>
        <label htmlFor="partner-memberships" className="mb-1.5 block text-sm font-medium text-foreground">
          Memberships and credentials
        </label>
        <input
          id="partner-memberships"
          name="memberships"
          placeholder="e.g. ANA, PNG, IBNS, ASA, GIA, PCGS or NGC dealer"
          value={form.memberships}
          onChange={(event) => setField("memberships", event.target.value)}
          aria-invalid={!!errors.memberships}
          aria-describedby={errors.memberships ? "partner-memberships-error" : undefined}
          className={inputClass(!!errors.memberships)}
        />
        <FieldError id="partner-memberships-error" message={errors.memberships} />
      </div>

      {isShop && (
        <fieldset>
          <legend className="text-sm font-medium text-foreground">Where do you sell today?</legend>
          <div className="mt-3 grid grid-cols-1 gap-2 min-[480px]:grid-cols-2">
            {SELL_TODAY_OPTIONS.map((option) => {
              const selected = form.sellToday.includes(option);
              return (
                <label
                  key={option}
                  className={`flex min-h-11 cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2 text-sm transition-colors ${
                    selected ? "border-primary bg-primary/10 text-foreground" : "border-border bg-background hover:border-primary/40 hover:bg-muted"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4 shrink-0 accent-primary"
                    checked={selected}
                    onChange={() => toggle("sellToday", option)}
                  />
                  {option}
                </label>
              );
            })}
          </div>
        </fieldset>
      )}

      <div>
        <label htmlFor="partner-notes" className="mb-1.5 block text-sm font-medium text-foreground">
          Anything else we should know?
        </label>
        <textarea
          id="partner-notes"
          name="notes"
          rows={4}
          maxLength={500}
          value={form.notes}
          onChange={(event) => setField("notes", event.target.value)}
          aria-invalid={!!errors.notes}
          aria-describedby={errors.notes ? "partner-notes-error" : "partner-notes-count"}
          className={`w-full resize-none rounded-xl border bg-muted px-4 py-3 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 sm:text-sm ${
            errors.notes ? "border-destructive ring-1 ring-destructive/30" : "border-border"
          }`}
        />
        <div className="mt-1.5 flex items-start justify-between gap-3">
          <FieldError id="partner-notes-error" message={errors.notes} />
          <p id="partner-notes-count" className="ml-auto text-xs text-muted-foreground">
            {form.notes.length}/500
          </p>
        </div>
      </div>

      <div>
        <label className="flex items-start gap-2.5 text-sm text-foreground">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 accent-primary"
            checked={form.consent}
            onChange={(event) => setField("consent", event.target.checked)}
            aria-invalid={!!errors.consent}
            aria-describedby={errors.consent ? "partner-consent-error" : undefined}
          />
          <span>
            I agree that Trackzio can contact me about this application. See our{" "}
            <Link href="/privacy" className="font-medium text-primary underline-offset-2 hover:underline">
              Privacy Policy
            </Link>
            .
          </span>
        </label>
        <FieldError id="partner-consent-error" message={errors.consent} />
      </div>

      {submitError && (
        <p className="text-sm text-destructive" role="alert">
          {submitError}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-primary px-6 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60 glow sm:w-auto"
      >
        {isSubmitting ? "Sending…" : "Send application"}
      </button>
    </form>
  );
}
