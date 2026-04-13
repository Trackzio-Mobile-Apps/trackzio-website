# Trackzio marketing site — CMS backend & admin panel (full specification)

**Purpose:** One document the team can use to implement the API, database, and the admin UI: **all collections**, **all endpoints**, request/response shapes, and **ordered implementation steps**.

**Audience:** Backend engineers, frontend engineers, DevOps.

**Stakeholder-friendly overview (goals, flows, glossary):** see [`PRD-trackzio-cms.md`](./PRD-trackzio-cms.md).

**API behavior, sequence flows & edge cases (auth, CRUD, uploads, Netlify):** see [`backend-api-flow-and-edge-cases.md`](./backend-api-flow-and-edge-cases.md).

**Frontend repo:** Vite + React (`trackzio-shine-project`). Content today: `src/lib/appData.ts`, `src/lib/blogData.ts`, hardcoded `Careers` / `About`. This spec replaces static data with API-driven CMS.

---

## Table of contents

1. [Architecture](#1-architecture)
2. [Collections — complete schemas](#2-collections--complete-schemas)
3. [Indexes & constraints](#3-indexes--constraints)
4. [Authentication API](#4-authentication-api)
5. [Public API — full catalog](#5-public-api--full-catalog)
6. [Admin API — full catalog](#6-admin-api--full-catalog)
7. [Implementation phases — backend (API)](#7-implementation-phases--backend-api)
8. [Implementation phases — admin panel](#8-implementation-phases--admin-panel)
9. [Implementation phases — public site integration](#9-implementation-phases--public-site-integration)
10. [File uploads](#10-file-uploads)
11. [Errors, validation, caching](#11-errors-validation-caching)
12. [Environment variables](#12-environment-variables)
13. [Monorepo: `/admin` vs separate app](#13-monorepo-admin-vs-separate-app)
14. [Document history](#14-document-history)

---

## 1. Architecture

| Layer | Responsibility |
|--------|----------------|
| **Public SPA** | Marketing site; **only** calls `GET /api/public/*` (and auth login is not used on public pages). |
| **Admin SPA** | Routes under `/admin`; calls `/api/auth/*` and `/api/admin/*`; CRUD + uploads. |
| **Backend API** | Single service (Node, etc.); enforces auth on `/api/admin/*`; reads/writes DB + storage. |
| **Database** | All CMS entities below. |
| **Object storage** | S3-compatible / Firebase Storage / R2; DB stores **HTTPS URLs** only. |

**Security:** `/admin` is not “secret”; **all writes** require authenticated admin. Public endpoints are read-only and return only `published` content.

---

## 2. Collections — complete schemas

Use these names consistently (MongoDB/Firestore **collection** names or SQL **table** names). Internal `_id` / `id` strategy: either database-generated UUID/ObjectId **or** natural key where noted.

---

### 2.1 `users`

Admin accounts only (not end customers).

| Field | Type | Required | Notes |
|-------|------|----------|--------|
| `_id` | ObjectId / UUID | auto | Primary key. |
| `email` | string | yes | Unique, lowercase, trimmed. |
| `passwordHash` | string | yes | bcrypt or argon2; **never** returned by API. |
| `role` | string | yes | `admin` (extend later: `editor`). |
| `createdAt` | ISO datetime | yes | |
| `updatedAt` | ISO datetime | yes | |

**API responses:** Never include `passwordHash`. Return `{ id, email, role }` only.

---

### 2.2 `apps`

One document per product (Coinzy, Banknotes, etc.). **`id`** = stable URL slug (e.g. `coinzy`).

| Field | Type | Required | Notes |
|-------|------|----------|--------|
| `id` | string | yes | Unique slug; primary business key for URLs and `featuredAppIds`. |
| `name` | string | yes | Display name. |
| `tagline` | string | yes | Short line under title. |
| `description` | string | yes | Long description (Apps + detail page). |
| `color` | string | yes | Full CSS color, e.g. `hsl(174, 60%, 35%)`. |
| `accentHsl` | string | yes | Space-separated HSL for tokens, e.g. `174 60% 35%`. |
| `iconEmoji` | string | no | Optional emoji for UI. |
| `logoUrl` | string | yes | HTTPS URL from storage. |
| `iosUrl` | string \| null | yes | App Store URL or `null`. |
| `androidUrl` | string \| null | yes | Play Store URL or `null`. |
| `screenshotUrls` | string[] | yes | Ordered list of image URLs. |
| `features` | object[] | yes | Each: `{ "icon": string, "title": string, "description": string }`. |
| `stats` | object | yes | `{ "downloads": string, "rating": string, "dau": string }` (display strings). |
| `order` | number | yes | Sort key for `/api/public/apps` (ascending). |
| `published` | boolean | yes | If `false`, excluded from public API. |
| `createdAt` | ISO datetime | yes | |
| `updatedAt` | ISO datetime | yes | |

---

### 2.3 `site_settings`

Key-value documents for site-wide toggles. Use **fixed document keys** (or `_id` = key name).

**Document key: `home`**

| Field | Type | Required | Notes |
|-------|------|----------|--------|
| `key` | string | yes | Constant `"home"`. |
| `featuredAppIds` | string[] | yes | Ordered list of `apps.id`; drives homepage carousel / spotlight. |
| `updatedAt` | ISO datetime | yes | |

**Validation:** Every id in `featuredAppIds` must exist in `apps` and should be `published: true` (return `409` if invalid).

**Document key: `blog`**

| Field | Type | Required | Notes |
|-------|------|----------|--------|
| `key` | string | yes | Constant `"blog"`. |
| `blogOfTheDaySlug` | string \| null | yes | Must match `blog_posts.slug` where `published: true`, or `null`. |
| `updatedAt` | ISO datetime | yes | |

---

### 2.4 `blog_categories`

| Field | Type | Required | Notes |
|-------|------|----------|--------|
| `slug` | string | yes | Unique; URL segment (e.g. `personal-growth`). |
| `title` | string | yes | Display name (e.g. `Personal Growth`). |
| `sortOrder` | number | yes | Ascending for nav/filters. |
| `createdAt` | ISO datetime | yes | |
| `updatedAt` | ISO datetime | yes | |

---

### 2.5 `blog_posts`

| Field | Type | Required | Notes |
|-------|------|----------|--------|
| `slug` | string | yes | Unique; URL segment for article page. |
| `categorySlug` | string | yes | FK-style reference to `blog_categories.slug`. |
| `title` | string | yes | |
| `excerpt` | string | yes | Card + meta description. |
| `body` | string | yes | **Decide one:** Markdown or HTML; store as single string. |
| `bodyFormat` | string | no | `markdown` \| `html` — if omitted, default in code. |
| `publishedAt` | ISO datetime | yes | Shown as “date” on site. |
| `readTimeMinutes` | number | no | Or `readTimeLabel` string (e.g. `8 min`) for exact UI parity. |
| `coverImageUrl` | string | yes | |
| `authorName` | string | yes | |
| `featured` | boolean | yes | Highlight on listing. |
| `published` | boolean | yes | Draft vs live. |
| `createdAt` | ISO datetime | yes | |
| `updatedAt` | ISO datetime | yes | |

**Blog of the day:** Controlled only via `site_settings` key `blog` → `blogOfTheDaySlug` (not a duplicate flag on each post), so only one spotlight exists.

---

### 2.6 `job_postings`

| Field | Type | Required | Notes |
|-------|------|----------|--------|
| `id` | string | yes | UUID or slug; unique. |
| `title` | string | yes | |
| `description` | string | yes | Can be multiline / HTML if you allow. |
| `location` | string | yes | e.g. `Remote · India`. |
| `employmentType` | string | yes | e.g. `Internship`, `Full-time`, `Contract`. |
| `applyUrl` | string | yes | Google Form or ATS link. |
| `sortOrder` | number | yes | Ascending on careers page. |
| `published` | boolean | yes | |
| `createdAt` | ISO datetime | yes | |
| `updatedAt` | ISO datetime | yes | |

---

### 2.7 `team_members`

| Field | Type | Required | Notes |
|-------|------|----------|--------|
| `id` | string | yes | UUID. |
| `name` | string | yes | |
| `role` | string | yes | Job title / label. |
| `linkedinUrl` | string | yes | Full URL. |
| `photoUrl` | string | yes | |
| `sortOrder` | number | yes | Grid order. |
| `published` | boolean | yes | |
| `createdAt` | ISO datetime | yes | |
| `updatedAt` | ISO datetime | yes | |

---

## 3. Indexes & constraints

| Collection | Index / constraint |
|------------|---------------------|
| `users` | Unique index on `email`. |
| `apps` | Unique on `id` (slug). Index `published` + `order` for public list. |
| `site_settings` | Unique on `key` (`home`, `blog`). |
| `blog_categories` | Unique on `slug`. Index `sortOrder`. |
| `blog_posts` | Unique on `slug`. Index `published`, `publishedAt`, `categorySlug`. |
| `job_postings` | Unique on `id`. Index `published` + `sortOrder`. |
| `team_members` | Unique on `id`. Index `published` + `sortOrder`. |

**Referential integrity:** On `PUT /api/admin/site/home`, validate `featuredAppIds` against `apps`. On `PUT /api/admin/site/blog`, validate `blogOfTheDaySlug` against published `blog_posts` if not null.

---

## 4. Authentication API

**Base path:** `/api/auth`

### `POST /api/auth/login`

**Request**

```json
{
  "email": "admin@company.com",
  "password": "••••••••"
}
```

**Response `200`**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "admin@company.com",
    "role": "admin"
  },
  "expiresAt": "2026-04-09T12:00:00.000Z"
}
```

*Alternative:* `Set-Cookie` httpOnly session — no `token` in JSON; subsequent requests use cookie.

**Response `401`:** Invalid credentials.

### `POST /api/auth/logout` (optional)

Invalidates session / blacklist JWT cookie. **Response `204`** no body.

### `GET /api/auth/me` (optional)

Returns current user if valid token/cookie. **Response `200`:** same `user` object as login. **Response `401`** if not authenticated.

**Admin rule:** All `/api/admin/*` require valid auth + `role === "admin"` (or allowed roles).

---

## 5. Public API — full catalog

**Base path:** `/api/public`  
**Auth:** None.  
**Rule:** Return only rows with `published: true` where applicable. Omit drafts.

### `GET /api/public/site`

Aggregated payload for fast first load (optional).

**Response `200`**

```json
{
  "home": {
    "featuredAppIds": ["coinzy", "banknotes"]
  },
  "blog": {
    "blogOfTheDaySlug": "small-habits-beat-big-resolutions"
  },
  "apps": [ /* full App objects, published only, sorted by order */ ],
  "blogCategories": [ /* category objects */ ],
  "blogPosts": [ /* summary objects — see below */ ],
  "jobPostings": [ /* full job objects, published */ ],
  "teamMembers": [ /* full team objects, published */ ]
}
```

**Note:** If `blogPosts` list is large, return **summaries** only here; full `body` on `GET /api/public/blog/posts/:slug`.

**Blog post summary** (for lists):

```json
{
  "slug": "small-habits-beat-big-resolutions",
  "categorySlug": "personal-growth",
  "title": "…",
  "excerpt": "…",
  "publishedAt": "2026-03-20T00:00:00.000Z",
  "readTimeMinutes": 8,
  "coverImageUrl": "https://…",
  "authorName": "…",
  "featured": false
}
```

---

### `GET /api/public/apps`

**Response `200`:** Array of full App objects (see §2.2), `published: true`, sorted by `order` ascending.

---

### `GET /api/public/apps/:idOrSlug`

**Params:** `idOrSlug` = `apps.id`.

**Response `200`:** Single App object.

**Response `404`:** Not found or unpublished.

---

### `GET /api/public/blog/categories`

**Response `200`:** Array of `{ slug, title, sortOrder }`, sorted by `sortOrder`.

---

### `GET /api/public/blog/posts`

**Query parameters**

| Param | Type | Description |
|-------|------|-------------|
| `categorySlug` | string | Optional; filter by category. |
| `limit` | number | Optional; default e.g. 20, max 100. |
| `cursor` | string | Optional; opaque pagination cursor. |

**Response `200`**

```json
{
  "items": [ /* blog post summaries */ ],
  "nextCursor": "opaque-or-null"
}
```

Only `published: true`. Sort by `publishedAt` descending (newest first).

---

### `GET /api/public/blog/posts/:slug`

**Response `200`:** Full post including `body`.

**Response `404`:** Unknown slug or unpublished.

---

### `GET /api/public/careers/jobs`

**Response `200`:** Array of job objects (§2.6), `published: true`, sorted by `sortOrder` ascending.

---

### `GET /api/public/team`

**Response `200`:** Array of team member objects (§2.7), `published: true`, sorted by `sortOrder` ascending.

---

## 6. Admin API — full catalog

**Base path:** `/api/admin`  
**Auth:** `Authorization: Bearer <token>` **or** session cookie.  
**Rule:** Reject with `401` / `403` if missing or not admin.

---

### 6.1 Apps

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/admin/apps` | All apps (include `published: false`). Sort by `order` or `updatedAt`. |
| `POST` | `/api/admin/apps` | Create app. Body = full App payload (§2.2); server sets `createdAt`/`updatedAt`. |
| `GET` | `/api/admin/apps/:id` | One app by `id`. |
| `PATCH` | `/api/admin/apps/:id` | Partial update; merge fields. |
| `DELETE` | `/api/admin/apps/:id` | Prefer **soft delete:** `PATCH` with `{ "published": false }` **or** hard delete if product allows. |

**`POST` validation:** `id` unique; URLs valid format; `screenshotUrls` non-empty array optional policy.

---

### 6.2 Site — home

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/admin/site/home` | Returns `{ "featuredAppIds": [...] }`. |
| `PUT` | `/api/admin/site/home` | Body `{ "featuredAppIds": ["coinzy", ...] }`. Validate each id exists in `apps`. |

---

### 6.3 Site — blog spotlight

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/admin/site/blog` | Returns `{ "blogOfTheDaySlug": string \| null }`. |
| `PUT` | `/api/admin/site/blog` | Body `{ "blogOfTheDaySlug": "slug-or-null" }`. If non-null, post must exist and be publishable. |

---

### 6.4 Blog categories

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/admin/blog/categories` | All categories. |
| `POST` | `/api/admin/blog/categories` | Body: `{ slug, title, sortOrder }`. |
| `GET` | `/api/admin/blog/categories/:slug` | Optional if list is enough. |
| `PATCH` | `/api/admin/blog/categories/:slug` | Partial update. |
| `DELETE` | `/api/admin/blog/categories/:slug` | Reject or cascade if posts reference — **recommend** block delete with `409` if posts exist. |

---

### 6.5 Blog posts

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/admin/blog/posts` | Query: `categorySlug`, `published`, `limit`, `cursor`. |
| `POST` | `/api/admin/blog/posts` | Create; body matches §2.5. |
| `GET` | `/api/admin/blog/posts/:slug` | Full post including drafts. |
| `PATCH` | `/api/admin/blog/posts/:slug` | Partial update. |
| `DELETE` | `/api/admin/blog/posts/:slug` | Soft-delete via `published: false` recommended. |

---

### 6.6 Careers

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/admin/careers/jobs` | All jobs. |
| `POST` | `/api/admin/careers/jobs` | Body matches §2.6; server may generate `id`. |
| `GET` | `/api/admin/careers/jobs/:id` | |
| `PATCH` | `/api/admin/careers/jobs/:id` | |
| `DELETE` | `/api/admin/careers/jobs/:id` | Soft-delete preferred. |

---

### 6.7 Team

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/admin/team/members` | All members. |
| `POST` | `/api/admin/team/members` | Body matches §2.7. |
| `GET` | `/api/admin/team/members/:id` | |
| `PATCH` | `/api/admin/team/members/:id` | |
| `DELETE` | `/api/admin/team/members/:id` | Soft-delete preferred. |

---

### 6.8 Uploads

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/admin/uploads/presign` | Body `{ "filename": "x.png", "contentType": "image/png" }` → `{ "uploadUrl", "publicUrl", "headers" }` or S3 fields. |
| `POST` | `/api/admin/uploads/image` | `multipart/form-data` field `file` → `{ "url": "https://…" }`. |

---

### 6.9 Users (optional, super-admin only)

If you need to create admins from API later:

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/admin/users` | Create user with hashed password (or invite flow). |

Omit in v1 if first admin is created by seed script.

---

## 7. Implementation phases — backend (API)

Execute in order; each phase should be testable before moving on.

| Step | Task | Details |
|------|------|--------|
| **B1** | Project setup | Repo, runtime (Node LTS), linter, env loading. |
| **B2** | Database | Provision DB; create collections/tables per §2; add indexes per §3. |
| **B3** | Seed script | Seed first `users` admin (hashed password); seed `site_settings` docs `home` + `blog` with safe defaults. |
| **B4** | Password hashing | bcrypt/argon2 helper; never log plaintext passwords. |
| **B5** | Auth | Implement `POST /api/auth/login`; issue JWT or session; middleware verifying token on `/api/admin/*`. |
| **B6** | Public read — apps | `GET /api/public/apps`, `GET /api/public/apps/:id` with `published` filter. |
| **B7** | Public read — site | `GET /api/public/site` OR incremental; wire `home` + `blog` from `site_settings`. |
| **B8** | Public read — blog | Categories, post list, single post by slug. |
| **B9** | Public read — careers & team | Jobs + team lists. |
| **B10** | Admin CRUD — apps | Full §6.1; `PATCH` updates `updatedAt`. |
| **B11** | Admin — site home & blog | §6.2–6.3 with validation against `apps` and `blog_posts`. |
| **B12** | Admin CRUD — blog | Categories + posts §6.4–6.5. |
| **B13** | Admin CRUD — jobs & team | §6.6–6.7. |
| **B14** | Uploads | §6.8 + size/MIME limits; CORS if admin on different origin. |
| **B15** | Hardening | Rate limit login; structured logs; `401`/`403`/`409` consistent with §11. |
| **B16** | Deploy | Staging + production; HTTPS only; secrets in vault/env. |

**Testing:** For each resource, add at least: list (public), get by id (public), create (admin), update (admin), unpublish (admin), 401 without token.

---

## 8. Implementation phases — admin panel

Same React app; lazy routes under `/admin`.

| Step | Task | Details |
|------|------|--------|
| **A1** | Routing | Add `react-router` routes for `/admin/login`, `/admin`, and section routes (below). Code-split with `React.lazy`. |
| **A2** | API client | Base URL `VITE_API_URL`; attach `Authorization` header from auth context. |
| **A3** | Auth state | Login form → `POST /api/auth/login` → store token (memory + `sessionStorage` if JWT) **or** rely on cookie; `GET /api/auth/me` on app load. |
| **A4** | Route guard | If not authenticated, redirect `/admin/*` → `/admin/login` except login page. |
| **A5** | Layout | Sidebar or top nav: Apps, Home order, Blog (categories, posts, spotlight), Careers, Team. |
| **A6** | Apps CRUD | List table; create/edit form (react-hook-form + zod mirroring §2.2); image fields use upload then paste URL. |
| **A7** | Home order | Page showing published apps; drag-and-drop list → `PUT /api/admin/site/home` with ordered `featuredAppIds`. |
| **A8** | Blog categories | Table + modal/form; `POST`/`PATCH`/`DELETE` per §6.4. |
| **A9** | Blog posts | List with filters; editor for `body` (Markdown or rich text); cover image upload; `published` toggle; `featured` toggle. |
| **A10** | Blog spotlight | Dropdown of published posts → `PUT /api/admin/site/blog`. |
| **A11** | Careers | Table + form for jobs; `sortOrder` numeric or drag. |
| **A12** | Team | Table + form; photo upload; reorder → `PATCH` sortOrder batch or single. |
| **A13** | UX | Toasts on save/error; confirm on delete; loading states. |

---

## 9. Implementation phases — public site integration

| Step | Task | Details |
|------|------|--------|
| **P1** | Env | `VITE_PUBLIC_API_URL` pointing to `/api/public` base (or full API base + paths). |
| **P2** | Data layer | TanStack Query hooks: `useSite()`, `useApps()`, `useBlogPost(slug)`, etc. |
| **P3** | Replace static data | Remove hard dependency on `appData` / `blogData` arrays; map API shapes to existing components. |
| **P4** | Images | Use `logoUrl`, `screenshotUrls`, `coverImageUrl`, `photoUrl` as `<img src>` (no bundler imports for CMS images). |
| **P5** | Fallback | Optional: keep static fallback if API fails, or show error boundary / retry. |
| **P6** | SEO | If posts are client-rendered, ensure meta tags from post `title`/`excerpt` (or move to SSR later). |

---

## 10. File uploads

1. User picks file in admin form.  
2. `POST /api/admin/uploads/image` **or** presign then `PUT` to storage.  
3. Receive `url`.  
4. Submit form `PATCH` with `logoUrl` / `coverImageUrl` / `photoUrl` / `screenshotUrls`.  
5. Public site renders URLs.

**Limits:** e.g. max 5 MB; MIME `image/jpeg`, `image/png`, `image/webp`, `image/gif` as needed.

---

## 11. Errors, validation, caching

### HTTP status

| Code | When |
|------|------|
| `400` | Validation failed; body `{ "errors": [{ "field", "message" }] }`. |
| `401` | Missing/invalid auth. |
| `403` | Authenticated but not allowed (non-admin). |
| `404` | Resource not found. |
| `409` | Duplicate `slug`/`id`; invalid `featuredAppIds`; delete category with posts. |

### Caching (public GETs)

- `Cache-Control: public, max-age=60` (or 300) on `/api/public/*`.  
- Admin: `Cache-Control: private, no-store` on `/api/admin/*`.

---

## 12. Environment variables

**Backend (example names)**

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | Connection string. |
| `JWT_SECRET` | If using JWT. |
| `SESSION_SECRET` | If using cookie sessions. |
| `S3_BUCKET`, `S3_REGION`, keys | Or R2/Firebase equivalents. |
| `CORS_ORIGIN` | Public + admin site origins. |

**Frontend**

| Variable | Purpose |
|----------|---------|
| `VITE_PUBLIC_API_URL` | Base URL for public API (e.g. `https://api.example.com/api/public`). |
| `VITE_API_URL` | Base for admin + auth (e.g. `https://api.example.com`); admin appends `/api/admin`, etc. |

---

## 13. Monorepo: `/admin` vs separate app

| Approach | When |
|----------|------|
| **Same repo, `/admin`** | Default: one deploy, shared types, faster delivery. Lazy-load admin routes. |
| **Separate admin project** | Different domain, compliance, or large dedicated admin — use OpenAPI or shared package for types. |

---

## 14. Document history

| Version | Date | Notes |
|---------|------|--------|
| 1.0 | 2026-04-08 | Initial spec. |
| 2.0 | 2026-04-08 | Full collections, full API catalog, phased backend/admin/public steps. |

---

*Update this file in PRs when the API or fields change so the team stays aligned.*
