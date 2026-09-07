/**
 * FRICTION POINT — PRODUCT LOGIC
 * Pure functions over a product array. Same rules as the original
 * static-site build: featured falls back to newest Pull the Trigger
 * pick, latest is sorted by dateAdded, etc.
 */

export function byCategory(products, category) {
  return products.filter((p) => p.category === category);
}

export function pullTheTrigger(products) {
  return products.filter((p) => p.pullTheTrigger === true);
}

export function featured(products) {
  const marked = products.filter((p) => p.featured === true);
  if (marked.length) {
    return sortByDateDesc(marked)[0];
  }
  const ptt = sortByDateDesc(pullTheTrigger(products));
  return ptt[0] || null;
}

export function latest(products, n = 8) {
  return sortByDateDesc(products).slice(0, n);
}

export function sortByDateDesc(products) {
  return [...products].sort(
    (a, b) => new Date(b.dateAdded) - new Date(a.dateAdded)
  );
}

export function retailerLabel(product) {
  return product.retailer ? `VIEW ON ${product.retailer.toUpperCase()}` : "VIEW PRODUCT";
}

export function search(products, query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return products
    .filter((p) => {
      const hay = [p.name, p.brand, p.category, ...(p.tags || [])]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    })
    .slice(0, 8);
}

/**
 * Picks a real photo to represent a category on the homepage — the
 * newest product in that category that actually has an uploaded photo
 * (not the shared placeholder). Returns null if none exists yet, so the
 * card can fall back to a plain text-only treatment instead of a fake
 * illustration.
 */
export function categoryThumbnail(products, category) {
  const withPhotos = sortByDateDesc(
    byCategory(products, category).filter(
      (p) => p.image && !p.image.includes("_placeholder")
    )
  );
  return withPhotos[0]?.image || null;
}

export const CATEGORIES = {
  EDC: { title: "EDC", desc: "Everyday carry essentials." },
  KNIVES: { title: "Knives", desc: "Folding knives, fixed blades and cutting tools." },
  RANGE: { title: "Range", desc: "Firearms-related accessories, range equipment and shooting gear." },
  GEAR: { title: "Gear", desc: "Flashlights, bags, tools, organization, outdoor equipment and everything else worth carrying." },
};

export function slugify(s) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
