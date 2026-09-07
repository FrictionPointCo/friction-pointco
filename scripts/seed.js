/**
 * FRICTION POINT — DATABASE SEED SCRIPT
 * ======================================
 * Loads data/products.seed.json into the database (Vercel KV in
 * production, or data/products.local.json for local dev).
 *
 * Run this ONCE:
 *   - Locally:   npm run seed
 *   - Against a live Vercel KV store: pull env vars first with
 *     `vercel env pull .env.local`, then run `npm run seed`.
 *
 * Safe to re-run — it simply overwrites the product list with the
 * seed file, so only run it again if you actually want to reset back
 * to the 12 starter products.
 */
import { seedFromFile, usingRedis } from "../lib/db.js";

async function main() {
  console.log(usingRedis ? "Seeding your Redis database…" : "Seeding local dev database (data/products.local.json)…");
  const products = await seedFromFile();
  console.log(`Done. ${products.length} products loaded.`);
  if (!usingRedis) {
    console.log(
      "\nNote: KV_REST_API_URL / KV_REST_API_TOKEN aren't set, so this wrote to the local JSON fallback only.\n" +
      "To seed your real production database, pull your Vercel env vars first:\n" +
      "  vercel env pull .env.local\n" +
      "then run `npm run seed` again."
    );
  }
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
