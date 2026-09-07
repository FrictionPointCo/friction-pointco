# Friction Point

Gear worth carrying. A Next.js site with a password-protected admin dashboard for managing products — no code edits required to add, edit, delete, or feature gear.

## Stack

- **Next.js 14** (App Router) — pages, API routes, and middleware in one project
- **Vercel Redis (Upstash)** — persistent product database (falls back to a local JSON file for development)
- **Vanilla CSS** — the original design system, unchanged, driven by CSS custom properties in `app/globals.css`

## Quick start (local development)

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. Without any database configured, the app automatically uses `data/products.local.json` (seeded from `data/products.seed.json`) so you can develop without touching production data.

To try the admin dashboard locally, add to `.env.local` (copy from `.env.example`):

```
ADMIN_PASSWORD=whatever-you-want-locally
ADMIN_SESSION_SECRET=any-long-random-string
```

Then visit `http://localhost:3000/admin`.

## Deploying to production

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for the full walkthrough: pushing to GitHub, importing into Vercel, creating the Redis database, setting environment variables, seeding your starter products, and connecting your domain.

## Project structure

```
app/                    Pages and API routes (Next.js App Router)
  admin/                Password-protected dashboard (login, list, add, edit)
  api/                  REST endpoints for products + admin auth
  product/[id]/         Product detail pages
  [category]/           EDC / Knives / Range / Gear category pages
  globals.css           The entire design system — colors, type, components
components/             Shared React components (header, footer, cards, admin UI)
lib/
  db.js                 Database layer (Vercel Redis in prod, local JSON in dev)
  products.js           Pure product logic (featured, latest, search, etc.)
  auth.js               Admin session signing/verification
data/
  products.seed.json    The 12 starter products — used once, by `npm run seed`
public/images/          Logo, favicons, and product photography
```

## Managing products

Everything happens at `/admin` once deployed — no file editing:

- **Add a product** — `/admin/new`, fill out the form, save.
- **Edit a product** — click Edit on any row in `/admin`.
- **Delete a product** — click Delete on any row (asks for confirmation).
- **Feature a product / mark Pull the Trigger** — check the box directly in the product table, no need to open the edit form.

Changes appear on the live site immediately.
