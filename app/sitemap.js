import { getAllProducts } from "@/lib/db";

const SITE_URL = process.env.SITE_URL || "https://frictionpoint.example.com";

export default async function sitemap() {
  const products = await getAllProducts();

  const staticPages = [
    "", "pull-the-trigger", "edc", "knives", "range", "gear",
    "about", "affiliate-disclosure", "privacy", "terms", "contact",
  ].map((slug) => ({
    url: `${SITE_URL}/${slug}`,
    lastModified: new Date(),
  }));

  const productPages = products.map((p) => ({
    url: `${SITE_URL}/product/${p.id}`,
    lastModified: p.dateAdded ? new Date(p.dateAdded) : new Date(),
  }));

  return [...staticPages, ...productPages];
}
