# Deploying Friction Point

This is a Next.js app. Locally it can run with zero cloud setup (it falls
back to a local JSON file as its database). In production on Vercel, it
uses a real database (Vercel Redis, powered by Upstash) so the admin dashboard's changes persist.

---

## 1. Push to GitHub

```bash
cd friction-point
git init
git add .
git commit -m "Friction Point — initial production build"
```

Create a new empty repository on GitHub, then:

```bash
git remote add origin https://github.com/<your-username>/friction-point.git
git branch -M main
git push -u origin main
```

---

## 2. Import into Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and import the GitHub repo you just pushed.
2. Framework preset: Vercel auto-detects **Next.js** — leave build settings as default.
3. Don't click deploy yet — add the environment variables first (next step), or add them right after the first deploy and redeploy. Either order works.

---

## 3. Set environment variables

In the Vercel project → **Settings → Environment Variables**, add:

| Variable | Value |
|---|---|
| `ADMIN_PASSWORD` | A strong password you'll use to log into `/admin`. |
| `ADMIN_SESSION_SECRET` | A long random string. Generate one locally with `openssl rand -base64 32`. |
| `SITE_URL` | Your real domain once you have it, e.g. `https://frictionpoint.com`. You can update this later. |

Leave the `KV_REST_API_*` variables out for now — the next step adds them automatically.

---

## 4. Create the database (Redis, powered by Upstash)

> **Note:** "Vercel KV" was discontinued in December 2024. Its replacement is
> the **Redis** integration (built on Upstash) under Vercel's Marketplace —
> functionally the same thing, same environment variable names, new label.

1. In your Vercel project, go to the **Storage** tab.
2. Click **Create Database**, or **Browse Marketplace** if that's what your dashboard shows.
3. Find **Redis** (provided by Upstash) and select it.
4. Choose a plan (there's a free tier), name your database (e.g. `friction-point-db`), and create it.
5. When prompted, **connect it to this project** — this step matters, it's what wires up the environment variables.
6. Vercel automatically adds `KV_REST_API_URL` and `KV_REST_API_TOKEN` to your project's environment variables — you don't type these in yourself.
7. Redeploy the project (Deployments tab → ⋯ → Redeploy) so the new environment variables take effect.

If your dashboard's **Storage** tab looks different from this description, Vercel has likely changed the UI again since this was written — search their dashboard for "Redis" or "Upstash" and the steps will be the same in spirit: create it, connect it to this project, redeploy.

---

## 5. Seed the database with the starter products

The 12 starter products live in `data/products.seed.json`. Load them into your live Redis database once:

```bash
npm install -g vercel      # if you don't have the Vercel CLI yet
vercel login
vercel link                # links this folder to your Vercel project
vercel env pull .env.local # pulls your real KV credentials down locally
npm install
npm run seed
```

You should see `Done. 12 products loaded.` After this, your live site and admin dashboard are both reading from the real database.

**You only need to do this once.** After that, all product management happens through `/admin` — never by editing files.

---

## 6. Log into the admin dashboard

Visit `https://<your-vercel-url>/admin`. Log in with the `ADMIN_PASSWORD` you set in step 3. From there you can add, edit, delete, and toggle Featured / Pull the Trigger on any product — changes appear on the live site immediately, no redeploy needed.

---

## 7. Connect your domain

1. In Vercel: **Settings → Domains** → add your domain (e.g. `frictionpoint.com`).
2. Vercel shows you the DNS records to add. At your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.), add:
   - An `A` record pointing to Vercel's IP, **or**
   - A `CNAME` record pointing to `cname.vercel-dns.com` (for subdomains like `www`)
   (Vercel's Domains screen tells you exactly which one you need.)
3. Wait for DNS to propagate (usually minutes, sometimes longer) — Vercel shows a green checkmark once it's live.
4. Update the `SITE_URL` environment variable to match your real domain, then redeploy so canonical URLs, the sitemap, and social preview tags all use the correct domain.

---

## Ongoing use

- **Managing products:** everything happens at `/admin`. No code edits, no redeploys, no JSON files to touch.
- **Changing design/colors/logo/copy:** those still live in code (`app/globals.css` for colors, `public/images/brand/` for the logo, the page files under `app/` for copy) — edit, commit, push, and Vercel redeploys automatically.
- **Local development:** `npm install` then `npm run dev`. Without KV env vars set locally, it automatically uses `data/products.local.json` as a stand-in database, seeded from `data/products.seed.json` the first time — so you can develop and test without touching your production data.

---

## What's different from the original static build

The design, copy, product logic (Featured/Pull the Trigger/Latest Gear rules), and every page are unchanged. What changed to support the admin dashboard and database:

- The site is now a Next.js app instead of static HTML files (required for the database-backed admin API routes).
- Page URLs dropped the `.html` extension (`/knives` instead of `/knives.html`) — standard for a Next.js/Vercel deployment and better for SEO.
- Product data lives in a database instead of `products.json`. The `data/products.seed.json` file is only used once, to load your starter catalog.
