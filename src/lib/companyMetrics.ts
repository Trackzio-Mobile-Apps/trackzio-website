/** Company-wide figures. Home and the partner page both read this. */
export const COMPANY_DOWNLOADS = "400K+";
export const COMPANY_ACTIVE_USERS = "50K+";
export const COMPANY_AVERAGE_RATING = "4.3+";

export const homeMetrics = [
  { value: COMPANY_DOWNLOADS, label: "Downloads across all Trackzio apps" },
  { value: COMPANY_AVERAGE_RATING, label: "Average Rating" },
  { value: COMPANY_ACTIVE_USERS, label: "Active Users" },
] as const;
