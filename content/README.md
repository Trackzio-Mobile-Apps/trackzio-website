# Trackzio site content

Editors update files here. Run `npm run validate` before opening a PR.

## Folder layout

| Path | Format | Purpose |
|------|--------|---------|
| `blogs/*.md` | Markdown + YAML frontmatter | Blog posts |
| `apps/apps.json` | JSON array | Which apps appear on the site and in what order |
| `team/team.json` | JSON array | About page team grid |
| `jobs/jobs.json` | JSON array | Careers open roles |

**Static files** for team photos live under **`public/content/team/`** and are referenced by **root-relative URLs** in `team.json` (e.g. `/content/team/your-photo.jpg`). Adding a new photo = add the file under `public/content/team/` and add a JSON row — no code changes.

**Code** lives under `src/lib/content/` (schemas + loaders) and `scripts/validate-content.ts`.

---

## Slugs (global uniqueness)

Every content item that has a public slug must use **kebab-case**: lowercase letters, numbers, and hyphens only (`^[a-z0-9]+(?:-[a-z0-9]+)*$`).

**Slugs must be unique across:** blog posts, apps, team members, and jobs. The validator will report which two entries conflict.

---

## Blogs (`content/blogs/`)

- One file per post: **`{slug}.md`** — filename (without `.md`) must equal the `slug` in frontmatter.
- **Frontmatter:** `title`, `slug`, `published`, `date`, `dateDisplay`, `category`, `excerpt`, `readTime`, `image`, `author`; optional `featured`, `blogOfTheWeek`.

---

## Apps (`content/apps/apps.json`)

Array of:

```json
{ "id": "coinzy", "slug": "coinzy", "published": true, "order": 1 }
```

- **`id`** — must match an app in `src/lib/appData.ts` (used for `/apps/[id]`).
- **`slug`** — must equal **`id`** for this project (keeps routing and manifest aligned).
- **`published`** — if `false`, the app is hidden from loaders that filter published entries.
- **`order`** — display order (ascending).

---

## Team (`content/team/team.json`)

Array of:

```json
{
  "slug": "jane-doe",
  "name": "Jane Doe",
  "role": "Engineer",
  "linkedin": "https://www.linkedin.com/in/...",
  "image": "/content/team/jane-doe.jpg",
  "published": true
}
```

- Put the image file at **`public/content/team/jane-doe.jpg`** (path in JSON = URL path the browser requests).
- Set **`published`: false** to hide someone without deleting the row.

---

## Jobs (`content/jobs/jobs.json`)

Array of:

```json
{
  "slug": "senior-engineer",
  "title": "Senior Engineer",
  "description": "...",
  "location": "Remote",
  "type": "Full-time",
  "applyUrl": "https://...",
  "order": 1,
  "published": true
}
```

- **`order`** — unique among jobs; controls listing order.
- **`published`: false** — role hidden on the Careers page.

---

## Validation

```bash
npm run validate
```

Checks JSON shape (Zod), filename/slug alignment for blogs, duplicate slugs across the site, duplicate ids/slugs within a file, and that team **`image`** paths point to real files under **`public/`**.
