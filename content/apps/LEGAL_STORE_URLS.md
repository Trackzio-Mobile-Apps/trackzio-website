# App legal URLs (Play / App Store)

These paths are **fixed** for store listings and must not change. The site implements them in:

- `src/lib/appStoreLegalUrls.ts` — single source of truth for footer + app detail links
- `next.config.mjs` — `rewrites` (store URL → internal page) and `redirects` (nested route → store URL)
- `middleware.ts` — decoded colon paths (`/coinzy:-terms`) and legacy typo URLs

## Current permanent URLs

| App (id)   | Privacy                         | Terms                          |
| ---------- | ------------------------------- | ------------------------------ |
| banknotes  | `/privacy-policy-banknote`      | `/banknote-terms`              |
| coinzy     | `/privacy-policy-coinzy`        | `/coinzy%3A-terms`             |
| habiteazy  | `/privacy-policy-habit-eazy-1`  | `/habit-eazy%3A-terms`         |
| insecto    | `/privacy-policy-insecto-ai-1`  | `/terms-for-insecto-ai`        |
| rockzy     | `/privacy-policy-rockzy-ai`     | `/rockzy-terms-of-service`     |
| test-app-legal | `/privacy-policy-test-app-legal` | `/test-app-legal-terms`     |

Internal implementation routes (`/coinzy/privacy-policy`, `/coinzy/terms`, etc.) **redirect (301)** to the store URLs above so bookmarks still work.

---

## Adding a new app (example: `foozy`)

1. **`content/apps/apps.json`** — add the app with `id: "foozy"` (and slug, copy, assets as usual).

2. **Legal markdown** — add:

   - `content/apps/legal/foozy/privacy.md`
   - `content/apps/legal/foozy/terms.md`

3. **Pages**

   - For **new apps**, no manual page file is needed.
   - Dynamic routes (`pages/[appId]/privacy-policy.tsx` and `pages/[appId]/terms.tsx`) auto-generate pages from legal markdown.
   - Existing legacy app pages can remain as-is.

4. **Store URLs** — pick the **final** public paths (e.g. `/privacy-policy-foozy`, `/foozy-terms`) and register them:

   - In `src/lib/appStoreLegalUrls.ts`, add:

     ```ts
     foozy: {
       privacy: "/privacy-policy-foozy",
       terms: "/foozy-terms",
     },
     ```

   - In `next.config.mjs` → `rewrites().beforeFiles`, add:

     ```js
     { source: "/privacy-policy-foozy", destination: "/foozy/privacy-policy" },
     { source: "/foozy-terms", destination: "/foozy/terms" },
     ```

   - In `next.config.mjs` → `redirects`, add the **reverse** so nested URLs redirect to the store URLs:

     ```js
     { source: "/foozy/privacy-policy", destination: "/privacy-policy-foozy", permanent: true },
     { source: "/foozy/terms", destination: "/foozy-terms", permanent: true },
     ```

5. **Footer / detail page** — `Footer.tsx` builds `appLegalByAppId` from `APP_STORE_LEGAL_URLS`; add a row for `foozy` with label + spread `APP_STORE_LEGAL_URLS.foozy`. App detail pages automatically show Privacy / Terms when `app.id` exists in `APP_STORE_LEGAL_URLS`.

6. **Validation** — run `npm run validate` and `npm run build`.

7. **Store consoles** — use exactly the public URLs from step 4 (same strings as in `appStoreLegalUrls.ts`).
