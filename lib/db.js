/**
 * FRICTION POINT — DATA LAYER
 * ===========================
 * All products live under one key in Redis: "fp:products".
 * This is intentionally simple — a single JSON array, not a relational
 * schema — because the admin dashboard only ever needs to list, add,
 * edit, delete, and toggle a handful of flags on products.
 *
 * Uses Vercel's "Redis" Marketplace integration (powered by Upstash) —
 * the current replacement for the discontinued "Vercel KV" product.
 * Vercel injects the same KV_REST_API_URL / KV_REST_API_TOKEN variable
 * names for this integration, so no renaming is needed.
 *
 * Local development fallback:
 * If those environment variables aren't set (e.g. running `next dev`
 * without a linked Redis store), products are read from and written to
 * data/products.local.json instead, seeded automatically from
 * data/products.seed.json the first time. This means you can run the
 * whole app locally without any cloud database — production on Vercel
 * automatically uses real Redis once the integration is connected.
 */
import fs from "fs";
import path from "path";

const REDIS_KEY = "fp:products";
const LOCAL_DB_PATH = path.join(process.cwd(), "data", "products.local.json");
const SEED_PATH = path.join(process.cwd(), "data", "products.seed.json");

// Support both variable names Vercel's Redis (Upstash) integration may use.
const REDIS_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

const hasRedis = Boolean(REDIS_URL && REDIS_TOKEN);

let redisClient = null;
async function getRedis() {
  if (!redisClient) {
    const { Redis } = await import("@upstash/redis");
    redisClient = new Redis({ url: REDIS_URL, token: REDIS_TOKEN });
  }
  return redisClient;
}

function readLocalFile() {
  if (!fs.existsSync(LOCAL_DB_PATH)) {
    const seed = fs.existsSync(SEED_PATH)
      ? JSON.parse(fs.readFileSync(SEED_PATH, "utf-8"))
      : [];
    try {
      fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(seed, null, 2));
    } catch {
      // Read-only filesystem (this is normal on Vercel before the Redis
      // integration is connected — Vercel's servers don't allow writing
      // new files outside /tmp). Just serve the seed data without
      // persisting; reading still works fine either way.
    }
    return seed;
  }
  try {
    return JSON.parse(fs.readFileSync(LOCAL_DB_PATH, "utf-8"));
  } catch {
    return fs.existsSync(SEED_PATH)
      ? JSON.parse(fs.readFileSync(SEED_PATH, "utf-8"))
      : [];
  }
}

function writeLocalFile(products) {
  try {
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(products, null, 2));
  } catch {
    throw new Error(
      "Can't save changes yet — the database isn't connected. Add the Redis integration in Vercel (Storage tab), redeploy, then try again."
    );
  }
}

/** Get every product. */
export async function getAllProducts() {
  if (hasRedis) {
    const redis = await getRedis();
    const products = await redis.get(REDIS_KEY);
    return products || [];
  }
  return readLocalFile();
}

/** Replace the entire product list (internal helper). */
async function saveAllProducts(products) {
  if (hasRedis) {
    const redis = await getRedis();
    await redis.set(REDIS_KEY, products);
  } else {
    writeLocalFile(products);
  }
  return products;
}

/** Get a single product by id. */
export async function getProduct(id) {
  const products = await getAllProducts();
  return products.find((p) => p.id === id) || null;
}

/** Create a new product. Throws if the id is already taken. */
export async function createProduct(product) {
  const products = await getAllProducts();
  if (products.some((p) => p.id === product.id)) {
    throw new Error(`A product with id "${product.id}" already exists.`);
  }
  const next = [...products, product];
  await saveAllProducts(next);
  return product;
}

/** Update an existing product by id. Throws if it doesn't exist. */
export async function updateProduct(id, updates) {
  const products = await getAllProducts();
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) {
    throw new Error(`No product with id "${id}" found.`);
  }
  const updated = { ...products[idx], ...updates, id }; // id is immutable after creation
  products[idx] = updated;
  await saveAllProducts(products);
  return updated;
}

/** Delete a product by id. */
export async function deleteProduct(id) {
  const products = await getAllProducts();
  const next = products.filter((p) => p.id !== id);
  await saveAllProducts(next);
  return next.length !== products.length;
}

/** Used once by scripts/seed.js to load the starter catalog into the database. */
export async function seedFromFile() {
  const seed = JSON.parse(fs.readFileSync(SEED_PATH, "utf-8"));
  await saveAllProducts(seed);
  return seed;
}

export const usingRedis = hasRedis;
