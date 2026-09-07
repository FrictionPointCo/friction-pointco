import { NextResponse } from "next/server";
import { getAllProducts, createProduct } from "@/lib/db";
import { slugify } from "@/lib/products";

// GET /api/products — public, used by the site itself if needed.
export async function GET() {
  const products = await getAllProducts();
  return NextResponse.json(products);
}

// POST /api/products — protected by middleware.js (admin session required).
export async function POST(request) {
  try {
    const body = await request.json();

    if (!body.name || !body.brand || !body.category) {
      return NextResponse.json(
        { error: "Name, brand, and category are required." },
        { status: 400 }
      );
    }

    const id = body.id ? slugify(body.id) : slugify(`${body.brand}-${body.name}`);

    const product = {
      id,
      name: body.name,
      brand: body.brand,
      category: body.category,
      subcategory: body.subcategory || "",
      image: body.image || "",
      images: Array.isArray(body.images) ? body.images.filter(Boolean) : [],
      shortDescription: body.shortDescription || "",
      description: body.description || "",
      why: body.why || "",
      affiliateUrl: body.affiliateUrl || "",
      retailer: body.retailer || "",
      price: body.price || "",
      featured: Boolean(body.featured),
      pullTheTrigger: Boolean(body.pullTheTrigger),
      dateAdded: body.dateAdded || new Date().toISOString().slice(0, 10),
      tags: Array.isArray(body.tags)
        ? body.tags
        : (body.tags || "").split(",").map((t) => t.trim()).filter(Boolean),
      instagramUrl: body.instagramUrl || "",
    };

    const created = await createProduct(product);
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
