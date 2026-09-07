import { NextResponse } from "next/server";
import { getProduct, updateProduct, deleteProduct } from "@/lib/db";

// GET /api/products/[id] — public.
export async function GET(request, { params }) {
  const product = await getProduct(params.id);
  if (!product) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }
  return NextResponse.json(product);
}

// PUT /api/products/[id] — protected by middleware.js.
export async function PUT(request, { params }) {
  try {
    const body = await request.json();

    const updates = {
      name: body.name,
      brand: body.brand,
      category: body.category,
      subcategory: body.subcategory || "",
      image: body.image || "",
      shortDescription: body.shortDescription || "",
      description: body.description || "",
      why: body.why || "",
      affiliateUrl: body.affiliateUrl || "",
      retailer: body.retailer || "",
      price: body.price || "",
      featured: Boolean(body.featured),
      pullTheTrigger: Boolean(body.pullTheTrigger),
      dateAdded: body.dateAdded,
      tags: Array.isArray(body.tags)
        ? body.tags
        : (body.tags || "").split(",").map((t) => t.trim()).filter(Boolean),
      instagramUrl: body.instagramUrl || "",
    };

    const updated = await updateProduct(params.id, updates);
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

// DELETE /api/products/[id] — protected by middleware.js.
export async function DELETE(request, { params }) {
  const removed = await deleteProduct(params.id);
  if (!removed) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
