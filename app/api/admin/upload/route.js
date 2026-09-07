import { handleUpload } from "@vercel/blob/client";
import { NextResponse } from "next/server";

/**
 * FRICTION POINT — PHOTO UPLOAD
 * ==============================
 * Protected by middleware.js (admin session required, since this path
 * is under /api/admin). The browser calls this once to get a secure,
 * short-lived upload token, then uploads the actual photo file directly
 * to Vercel Blob storage — the file itself never passes through our
 * server, so there's no server-side file size limit to worry about.
 */
export async function POST(request) {
  const body = await request.json();

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
        addRandomSuffix: true,
        maximumSizeInBytes: 10 * 1024 * 1024, // 10MB — plenty for product photos
      }),
      onUploadCompleted: async () => {
        // Nothing to do here — the resulting URL is saved onto the
        // product record when the admin form is submitted.
      },
    });
    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
