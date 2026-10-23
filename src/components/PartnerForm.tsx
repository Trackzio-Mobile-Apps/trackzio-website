import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { toast } from "@/components/ui/sonner";
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { trackEvent } from "@/lib/analytics";
import { COUNTRIES, detectBrowserCountry, getCountry, getCountryByName, matchesPhoneCountry } from "@/lib/countries";
import { matchRegion, regionKeywords, regionsForCountry } from "@/lib/regions";
import {
  DEAL_OPTIONS,
  EXPERIENCE_OPTIONS,
  PARTNER_TYPES,
  SELL_TODAY_OPTIONS,
  firstNameFrom,
  PARTNER_FIELD_LIMITS,
  PARTNER_SEND_FAILED_TOAST,
  PARTNER_SENT_TOAST,
  thanksMessage,
  validatePartnerApplication,
  type PartnerApplicationInput,
  type PartnerField,
  type PartnerFieldErrors,
} from "@/lib/partnerForm";

const PARTNER_API_URL = process.env.NEXT_PUBLIC_PARTNER_APPLICATION_ENDPOINT;

function cityWithinLimit(city: string, region: string): string {
  const regionText = region.trim();
  const room = PARTNER_FIELD_LIMITS.cityState - regionText.length - (regionText ? 2 : 0);
  return city.slice(0, Math.max(0, room));
}

function joinLocation(city: string, region: string): string {
  return [cityWithinLimit(city, region).trim(), region.trim()].filter(Boolean).join(", ");
}

const inputClass = (invalid: boolean) =>
  `w-full h-11 min-h-[44px] rounded-xl border bg-muted px-4 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 sm:text-sm ${
    invalid ? "border-destructive ring-1 ring-destructive/30" : "border-border"
  }`;

function PhoneCodeSelect({
  value,
  invalid,
  describedBy,
  onChange,
}: {
  value: string;
  invalid: boolean;
  describedBy?: string;
  onChange: (code: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const selected = value ? getCountry(value) : null;
  const matches = COUNTRIES.filter((country) => matchesPhoneCountry(country, query));

  return (
    <>
      <input id="partner-phone-country" type="hidden" name="phone-country" value={value} autoComplete="tel-country-code" />
      <Popover
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) setQuery("");
        }}
      >
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label="Country code"
            aria-invalid={invalid}
            aria-describedby={describedBy}
            aria-expanded={open}
            className={`${inputClass(invalid)} flex items-center justify-between gap-2 pr-3 text-left`}
          >
            <span className={`truncate ${selected ? "" : "text-muted-foreground"}`}>
              {selected ? `+${selected.dial} ${selected.name}` : "Code"}
            </span>
            <ChevronDown aria-hidden className="h-4 w-4 shrink-0 text-muted-foreground" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-[min(20rem,var(--radix-popover-trigger-width))] min-w-[16rem] p-0"
          onCloseAutoFocus={(event) => event.preventDefault()}
        >
          <Command shouldFilter={false}>
            <CommandInput
              autoFocus
              placeholder="Search country or code"
              value={query}
              onValueChange={setQuery}
            />
            <CommandList>
              {matches.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">No country found.</p>
              ) : (
                <CommandGroup>
                  {matches.map((country) => (
                    <CommandItem
                      key={country.code}
                      value={`${country.code} ${country.dial} ${country.name}`}
                      onSelect={() => {
                        onChange(country.code);
                        setQuery("");
                        setOpen(false);
                      }}
                    >
                      <span className={country.code === value ? "font-semibold" : undefined}>
                        +{country.dial} {country.name}
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 text-sm text-destructive" role="alert">
      {message}
    </p>
  );
}

function OtherDetail({
  id,
  label,
  placeholder,
  value,
  message,
  onChange,
}: {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  message?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="mt-3">
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-foreground">
        {label} <span className="text-destructive">*</span>
      </label>
      <input
        id={id}
        value={value}
        placeholder={placeholder}
        maxLength={PARTNER_FIELD_LIMITS.otherDetail}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={!!message}
        aria-describedby={message ? `${id}-error` : undefined}
        className={inputClass(!!message)}
      />
      <FieldError id={`${id}-error`} message={message} />
    </div>
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
  partnerTypeOther: "",
  categoryOther: "",
  sellTodayOther: "",
  consent: false,
  fax: "",
});

function SearchSelect({
  id,
  name,
  value,
  placeholder,
  searchPlaceholder,
  emptyText,
  invalid,
  describedBy,
  options,
  onChange,
}: {
  id: string;
  name: string;
  value: string;
  placeholder: string;
  searchPlaceholder: string;
  emptyText: string;
  invalid?: boolean;
  describedBy?: string;
  options: readonly { value: string; label: string; keywords?: string }[];
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const needle = query.trim().toLowerCase();
  const matches = needle
    ? options.filter((option) =>
        [option.label, option.value, option.keywords ?? ""].join(" ").toLowerCase().includes(needle),
      )
    : options;

  return (
    <>
      <input type="hidden" name={name} value={value} />
      <Popover
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) setQuery("");
        }}
      >
        <PopoverTrigger asChild>
          <button
            type="button"
            id={id}
            aria-invalid={invalid || undefined}
            aria-describedby={describedBy}
            aria-expanded={open}
            className={`${inputClass(!!invalid)} flex items-center justify-between gap-2 pr-3 text-left`}
          >
            <span className={`truncate ${value ? "" : "text-muted-foreground"}`}>{value || placeholder}</span>
            <ChevronDown aria-hidden className="h-4 w-4 shrink-0 text-muted-foreground" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-[var(--radix-popover-trigger-width)] min-w-[16rem] p-0"
          onCloseAutoFocus={(event) => event.preventDefault()}
        >
          <Command shouldFilter={false}>
            <CommandInput autoFocus placeholder={searchPlaceholder} value={query} onValueChange={setQuery} />
            <CommandList>
              {matches.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">{emptyText}</p>
              ) : (
                <CommandGroup>
                  {matches.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={() => {
                        onChange(option.value);
                        setQuery("");
                        setOpen(false);
                      }}
                    >
                      <span className={option.value === value ? "font-semibold" : undefined}>{option.label}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
}

function LocationFields({
  country,
  city,
  region,
  cityState,
  message,
  onCity,
  onRegion,
  onCityState,
}: {
  country: string;
  city: string;
  region: string;
  cityState: string;
  message?: string;
  onCity: (value: string) => void;
  onRegion: (value: string) => void;
  onCityState: (value: string) => void;
}) {
  const regions = regionsForCountry(country);
  if (regions.length === 0) {
    return (
      <div>
        <label htmlFor="partner-city" className="mb-1.5 block text-sm font-medium text-foreground">
          City and state
        </label>
        <input
          id="partner-city"
          name="city"
          autoComplete="address-level2"
          value={cityState}
          maxLength={PARTNER_FIELD_LIMITS.cityState}
          onChange={(event) => onCityState(event.target.value)}
          aria-invalid={!!message}
          aria-describedby={message ? "partner-city-error" : undefined}
          className={inputClass(!!message)}
        />
        <FieldError id="partner-city-error" message={message} />
      </div>
    );
  }

  return (
    <>
      <div>
        <label htmlFor="partner-region" className="mb-1.5 block text-sm font-medium text-foreground">
          State or region
        </label>
        <SearchSelect
          id="partner-region"
          name="region"
          value={region}
          placeholder="Choose a state"
          searchPlaceholder="Search state"
          emptyText="No state found."
          options={regions.map((item) => ({
            value: item,
            label: item,
            keywords: regionKeywords(country, item),
          }))}
          onChange={onRegion}
        />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="partner-city" className="mb-1.5 block text-sm font-medium text-foreground">
          City
        </label>
        <input
          id="partner-city"
          name="city"
          autoComplete="address-level2"
          value={city}
          maxLength={Math.max(0, PARTNER_FIELD_LIMITS.cityState - (region.trim() ? region.trim().length + 2 : 0))}
          onChange={(event) => onCity(event.target.value)}
          aria-invalid={!!message}
          aria-describedby={message ? "partner-city-error" : undefined}
          className={inputClass(!!message)}
        />
        <FieldError id="partner-city-error" message={message} />
      </div>
    </>
  );
}

export default function PartnerForm({ initialCategory }: { initialCategory: string }) {
  const [form, setForm] = useState<PartnerApplicationInput>(() => emptyInput(initialCategory));
  const [errors, setErrors] = useState<PartnerFieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submittingRef = useRef(false);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [city, setCity] = useState("");
  const [region, setRegion] = useState("");
  const locationEdited = useRef(false);
  const phoneEdited = useRef(false);
  const cityRef = useRef("");
  const regionRef = useRef("");

  useEffect(() => {
    let cancelled = false;

    const fillLocation = (
      next: { countryCode?: string | null; city?: string; region?: string },
      overwrite: boolean,
    ) => {
      if (cancelled || locationEdited.current) return;
      const match = next.countryCode ? getCountry(next.countryCode) : null;
      const regionList = match ? regionsForCountry(match.name) : [];
      const regionName = matchRegion(regionList, next.region || "", match?.code);
      const cityName = (next.city || "").trim();
      const regionText = regionName || (regionList.length === 0 ? next.region || "" : "");
      const clippedCity = cityWithinLimit(cityName, regionText);
      const place = joinLocation(clippedCity, regionText);
      setForm((current) => ({
        ...current,
        phoneCountry: phoneEdited.current
          ? current.phoneCountry
          : overwrite || !current.phoneCountry
            ? match?.code || current.phoneCountry
            : current.phoneCountry,
        country: overwrite || !current.country ? match?.name || current.country : current.country,
        cityState: overwrite || !current.cityState ? place || current.cityState : current.cityState,
      }));
      if (regionName && (overwrite || !regionRef.current)) {
        regionRef.current = regionName;
        setRegion(regionName);
      }
      if (clippedCity && (overwrite || !cityRef.current)) {
        cityRef.current = clippedCity;
        setCity(clippedCity);
      }
    };

    async function detectLocation() {
      let countryCode: string | null = null;
      let detectedCity = "";
      let detectedRegion = "";
      try {
        const response = await fetch("/api/visitor-country");
        if (response.ok) {
          const data = (await response.json()) as { country?: unknown; city?: unknown; region?: unknown };
          if (typeof data.country === "string") countryCode = data.country.toUpperCase();
          if (typeof data.city === "string") detectedCity = data.city;
          if (typeof data.region === "string") detectedRegion = data.region;
        }
      } catch {
        countryCode = null;
      }
      if (!countryCode || !getCountry(countryCode)) countryCode = detectBrowserCountry();
      fillLocation({ countryCode, city: detectedCity, region: detectedRegion }, false);
      if (cancelled || detectedCity || detectedRegion || !navigator.geolocation) return;

      const position = await new Promise<GeolocationPosition | null>((resolve) => {
        navigator.geolocation.getCurrentPosition(
          (value) => resolve(value),
          () => resolve(null),
          { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 },
        );
      });
      if (cancelled || !position) return;
      try {
        const lookup = new URL("https://api.bigdatacloud.net/data/reverse-geocode-client");
        lookup.searchParams.set("latitude", String(position.coords.latitude));
        lookup.searchParams.set("longitude", String(position.coords.longitude));
        lookup.searchParams.set("localityLanguage", "en");
        const response = await fetch(lookup);
        if (!response.ok) return;
        const data = (await response.json()) as {
          countryCode?: unknown;
          countryName?: unknown;
          city?: unknown;
          locality?: unknown;
          principalSubdivision?: unknown;
          principalSubdivisionCode?: unknown;
        };
        const locatedCode =
          typeof data.countryCode === "string" && getCountry(data.countryCode)
            ? data.countryCode
            : typeof data.countryName === "string"
              ? getCountryByName(data.countryName)?.code
              : countryCode;
        const regionValue =
          typeof data.principalSubdivision === "string" && data.principalSubdivision
            ? data.principalSubdivision
            : typeof data.principalSubdivisionCode === "string"
              ? data.principalSubdivisionCode
              : "";
        fillLocation(
          {
            countryCode: locatedCode,
            city: typeof data.city === "string" && data.city ? data.city : typeof data.locality === "string" ? data.locality : "",
            region: regionValue,
          },
          true,
        );
      } catch {
        return;
      }
    }

    void detectLocation();
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
      setSubmitError(PARTNER_SEND_FAILED_TOAST);
      toast.error(PARTNER_SEND_FAILED_TOAST);
      trackEvent("partner_application_error", { page_name: "partners", reason: "save" });
      return;
    }
    if (submittingRef.current) return;

    const application = result.application;
    submittingRef.current = true;
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
        setSubmitError(PARTNER_SEND_FAILED_TOAST);
        toast.error(PARTNER_SEND_FAILED_TOAST);
        trackEvent("partner_application_error", { page_name: "partners", reason: "save" });
        return;
      }

      trackEvent("partner_application_submit", {
        page_name: "partners",
        partner_types: result.application.partnerTypes.join(", "),
        apps: result.application.apps.join(", "),
      });
      toast.success(PARTNER_SENT_TOAST);
      setFirstName(body.firstName || result.application.firstName);
    } catch {
      setSubmitError(PARTNER_SEND_FAILED_TOAST);
      toast.error(PARTNER_SEND_FAILED_TOAST);
      trackEvent("partner_application_error", { page_name: "partners", reason: "network" });
    } finally {
      submittingRef.current = false;
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
        {form.partnerTypes.includes("other") && (
          <OtherDetail
            id="partner-type-other"
            label="How else do you want to partner?"
            placeholder="e.g. Auction house, museum, publisher"
            value={form.partnerTypeOther}
            message={errors.partnerTypeOther}
            onChange={(value) => setField("partnerTypeOther", value)}
          />
        )}
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
        {form.categories.includes("other") && (
          <OtherDetail
            id="partner-category-other"
            label="What else do you deal in?"
            placeholder="e.g. Trading cards, vinyl, watches"
            value={form.categoryOther}
            message={errors.categoryOther}
            onChange={(value) => setField("categoryOther", value)}
          />
        )}
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
            maxLength={PARTNER_FIELD_LIMITS.fullName}
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
            maxLength={PARTNER_FIELD_LIMITS.businessName}
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
          maxLength={PARTNER_FIELD_LIMITS.email}
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
          <div className="w-full sm:w-64 sm:shrink-0">
            <PhoneCodeSelect
              value={form.phoneCountry}
              invalid={!!errors.phoneCountry}
              describedBy={errors.phoneCountry ? "partner-phone-country-error" : undefined}
              onChange={(code) => {
                phoneEdited.current = true;
                setField("phoneCountry", code);
              }}
            />
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
          <SearchSelect
            id="partner-country"
            name="country"
            value={form.country}
            placeholder="Choose a country"
            searchPlaceholder="Search country"
            emptyText="No country found."
            invalid={!!errors.country}
            describedBy={errors.country ? "partner-country-error" : undefined}
            options={COUNTRIES.map((country) => ({
              value: country.name,
              label: country.name,
              keywords: `${country.code} ${country.dial}`,
            }))}
            onChange={(name) => {
              const selected = getCountryByName(name);
              locationEdited.current = true;
              cityRef.current = "";
              regionRef.current = "";
              setCity("");
              setRegion("");
              setForm((current) => ({
                ...current,
                country: name,
                cityState: "",
                phoneCountry: selected?.code || current.phoneCountry,
              }));
              if (errors.country || errors.cityState || (selected && errors.phoneCountry)) {
                setErrors((current) => ({
                  ...current,
                  country: undefined,
                  cityState: undefined,
                  phoneCountry: selected ? undefined : current.phoneCountry,
                }));
              }
            }}
          />
          <FieldError id="partner-country-error" message={errors.country} />
        </div>
        <LocationFields
          country={form.country}
          city={city}
          region={region}
          cityState={form.cityState}
          message={errors.cityState}
          onCity={(value) => {
            locationEdited.current = true;
            const nextCity = cityWithinLimit(value, region);
            cityRef.current = nextCity;
            setCity(nextCity);
            setField("cityState", joinLocation(nextCity, region));
          }}
          onRegion={(value) => {
            locationEdited.current = true;
            const nextCity = cityWithinLimit(city, value);
            regionRef.current = value;
            cityRef.current = nextCity;
            setCity(nextCity);
            setRegion(value);
            setField("cityState", joinLocation(nextCity, value));
          }}
          onCityState={(value) => {
            locationEdited.current = true;
            setField("cityState", value);
          }}
        />
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
            maxLength={PARTNER_FIELD_LIMITS.website}
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
          maxLength={PARTNER_FIELD_LIMITS.specialties}
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
          maxLength={PARTNER_FIELD_LIMITS.memberships}
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
          {form.sellToday.includes("Other") && (
            <OtherDetail
              id="partner-sell-other"
              label="Where else do you sell?"
              placeholder="e.g. Instagram, a local market"
              value={form.sellTodayOther}
              message={errors.sellTodayOther}
              onChange={(value) => setField("sellTodayOther", value)}
            />
          )}
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
          maxLength={PARTNER_FIELD_LIMITS.notes}
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
            {form.notes.length}/{PARTNER_FIELD_LIMITS.notes}
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
