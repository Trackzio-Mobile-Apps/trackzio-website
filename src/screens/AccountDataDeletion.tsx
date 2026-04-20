"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "@/components/ui/sonner";
import { trackEvent } from "@/lib/analytics";
import { getClientApps } from "@/lib/content/apps-client";
import { usePageAnalytics } from "@/hooks/usePageAnalytics";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] as const },
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SUPPORT_EMAIL = "developer@trackzio.com";

type FormState = {
  fullName: string;
  email: string;
  appId: string;
  reason: string;
  consent: boolean;
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

const initialState: FormState = {
  fullName: "",
  email: "",
  appId: "",
  reason: "",
  consent: false,
};

export default function AccountDataDeletion() {
  usePageAnalytics("account_data_deletion", "account_data_deletion_page_view");
  const [formData, setFormData] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const apps = useMemo(() => {
    return getClientApps().map((app) => ({
      id: app.id,
      fullName: app.fullName,
    }));
  }, []);

  const appNameById = useMemo(() => {
    return new Map(apps.map((app) => [app.id, app.fullName]));
  }, [apps]);

  const validate = (): boolean => {
    const next: FieldErrors = {};
    const fullName = formData.fullName.trim();
    const email = formData.email.trim();
    const reason = formData.reason.trim();

    if (fullName.length < 2) {
      next.fullName = "Please enter your full name (at least 2 characters).";
    }

    if (!email) {
      next.email = "Email address is required.";
    } else if (!emailRegex.test(email)) {
      next.email = "Please enter a valid email address.";
    }

    if (!formData.appId) {
      next.appId = "Please select an app.";
    } else if (!appNameById.has(formData.appId)) {
      next.appId = "Please select a valid app from the list.";
    }

    if (reason.length > 1000) {
      next.reason = "Reason is too long (max 1,000 characters).";
    }

    if (!formData.consent) {
      next.consent = "You must confirm before submitting your request.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) {
      toast.error("Please review the form", {
        description: "Some fields are missing or invalid.",
      });
      return;
    }

    setIsSubmitting(true);

    const fullName = formData.fullName.trim();
    const email = formData.email.trim();
    const reason = formData.reason.trim();
    const appName = appNameById.get(formData.appId) ?? formData.appId;

    trackEvent("account_deletion_request_submitted", {
      page_name: "account_data_deletion",
      app_id: formData.appId,
    });

    const subject = encodeURIComponent(`Account deletion request - ${appName}`);
    const body = encodeURIComponent(
      `Full Name: ${fullName}\nEmail: ${email}\nApp: ${appName}\nReason: ${reason || "Not provided"}\nConsent confirmed: Yes`,
    );
    const mailto = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;

    toast.success("Request is ready to submit", {
      description: "Your email app will open with the request details prefilled.",
      duration: 6000,
    });

    setFormData(initialState);
    setErrors({});
    setIsSubmitting(false);

    window.setTimeout(() => {
      window.open(mailto, "_blank", "noopener,noreferrer");
    }, 200);
  };

  return (
    <section className="py-8 sm:py-12">
      <div className="container-site max-w-3xl">
        <motion.div {...fadeUp} className="rounded-2xl border border-border/70 bg-card p-5 sm:p-8" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="pb-5 border-b border-border/70">
            <h1 className="text-3xl sm:text-4xl font-bold font-display text-foreground">Request Account and Data Deletion</h1>
            <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
              Use the form below to request deletion of your account and data for one of our apps.
              <br />
              We will verify and process your request within 90 days.
            </p>
          </div>

          <form className="mt-6 space-y-4 sm:space-y-5" onSubmit={handleSubmit} noValidate>
            <div>
              <label htmlFor="deletion-full-name" className="block text-sm font-semibold text-foreground mb-1.5">
                Full Name <span className="text-destructive">*</span>
              </label>
              <input
                id="deletion-full-name"
                type="text"
                name="fullName"
                autoComplete="name"
                value={formData.fullName}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, fullName: e.target.value }));
                  if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: undefined }));
                }}
                placeholder="Enter your full name."
                aria-invalid={!!errors.fullName}
                aria-describedby={errors.fullName ? "deletion-full-name-error" : undefined}
                className={`w-full h-11 min-h-[44px] px-4 rounded-lg bg-background border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                  errors.fullName ? "border-destructive ring-1 ring-destructive/20" : "border-input"
                }`}
              />
              {errors.fullName && (
                <p id="deletion-full-name-error" className="mt-1.5 text-sm text-destructive" role="alert">
                  {errors.fullName}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="deletion-email" className="block text-sm font-semibold text-foreground mb-1.5">
                Email Address <span className="text-destructive">*</span>
              </label>
              <input
                id="deletion-email"
                type="email"
                name="email"
                autoComplete="email"
                inputMode="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, email: e.target.value }));
                  if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                placeholder="Enter the email linked to your account."
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "deletion-email-error" : undefined}
                className={`w-full h-11 min-h-[44px] px-4 rounded-lg bg-background border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                  errors.email ? "border-destructive ring-1 ring-destructive/20" : "border-input"
                }`}
              />
              {errors.email && (
                <p id="deletion-email-error" className="mt-1.5 text-sm text-destructive" role="alert">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="deletion-app" className="block text-sm font-semibold text-foreground mb-1.5">
                App <span className="text-destructive">*</span>
              </label>
              <select
                id="deletion-app"
                name="app"
                value={formData.appId}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, appId: e.target.value }));
                  if (errors.appId) setErrors((prev) => ({ ...prev, appId: undefined }));
                }}
                aria-invalid={!!errors.appId}
                aria-describedby={errors.appId ? "deletion-app-error" : undefined}
                className={`w-full h-11 min-h-[44px] px-4 rounded-lg bg-background border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                  errors.appId ? "border-destructive ring-1 ring-destructive/20" : "border-input"
                }`}
              >
                <option value="">Select an app</option>
                {apps.map((app) => (
                  <option key={app.id} value={app.id}>
                    {app.fullName}
                  </option>
                ))}
              </select>
              {errors.appId && (
                <p id="deletion-app-error" className="mt-1.5 text-sm text-destructive" role="alert">
                  {errors.appId}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="deletion-reason" className="block text-sm font-semibold text-foreground mb-1.5">
                Reason <span className="text-muted-foreground font-normal">(Optional)</span>
              </label>
              <textarea
                id="deletion-reason"
                name="reason"
                rows={4}
                value={formData.reason}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, reason: e.target.value }));
                  if (errors.reason) setErrors((prev) => ({ ...prev, reason: undefined }));
                }}
                placeholder="Optional: Enter your reason for deletion."
                aria-invalid={!!errors.reason}
                aria-describedby={errors.reason ? "deletion-reason-error" : undefined}
                className={`w-full min-h-[120px] px-4 py-3 rounded-lg bg-background border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y ${
                  errors.reason ? "border-destructive ring-1 ring-destructive/20" : "border-input"
                }`}
              />
              {errors.reason && (
                <p id="deletion-reason-error" className="mt-1.5 text-sm text-destructive" role="alert">
                  {errors.reason}
                </p>
              )}
            </div>

            <div>
              <label className="flex items-start gap-2.5 text-sm text-foreground">
                <input
                  type="checkbox"
                  checked={formData.consent}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, consent: e.target.checked }));
                    if (errors.consent) setErrors((prev) => ({ ...prev, consent: undefined }));
                  }}
                  className="mt-0.5 size-4 rounded border-input accent-primary"
                  aria-invalid={!!errors.consent}
                  aria-describedby={errors.consent ? "deletion-consent-error" : undefined}
                />
                <span>I understand that deleting my account may permanently remove my data and content.</span>
              </label>
              {errors.consent && (
                <p id="deletion-consent-error" className="mt-1.5 text-sm text-destructive" role="alert">
                  {errors.consent}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 min-h-[44px] rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Submit Deletion Request"}
            </button>
          </form>
        </motion.div>

        <motion.div {...fadeUp} className="mt-8 rounded-2xl border border-border/70 bg-card p-5 sm:p-8" style={{ boxShadow: "var(--shadow-card)" }}>
          <h2 className="text-2xl font-bold font-display text-foreground">What happens next</h2>
          <ol className="mt-4 list-decimal pl-5 space-y-2 text-muted-foreground">
            <li>We review your request</li>
            <li>Verify account ownership</li>
            <li>Process deletion within 90 days</li>
            <li>Send a confirmation email</li>
          </ol>
          <p className="mt-6 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Important:</span> We may retain certain information as required by law or for legitimate business purposes.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
