import { NextResponse } from "next/server";
import { getCategoryImages, setCategoryImage } from "@/lib/db";

const VALID_CATEGORIES = ["EDC", "KNIVES", "RANGE", "GEAR"];

// GET /api/admin/category-images — protected by middleware.js.
export async function GET() {
  const images = await getCategoryImages();
  return NextResponse.json(images);
}

// PUT /api/admin/category-images — protected by middleware.js.
// Body: { category: "EDC", url: "https://..." } (empty url clears it)
export async function PUT(request) {
  try {
    const { category, url } = await request.json();
    if (!VALID_CATEGORIES.includes(category)) {
      return NextResponse.json({ error: "Unknown category." }, { status: 400 });
    }
    const updated = await setCategoryImage(category, url || "");
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
