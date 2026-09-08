"use client";

import { useState, useEffect } from "react";
import { upload } from "@vercel/blob/client";
import AdminTopbar from "@/components/admin/AdminTopbar";

const CATEGORIES = [
  { key: "EDC", label: "EDC" },
  { key: "KNIVES", label: "Knives" },
  { key: "RANGE", label: "Range" },
  { key: "GEAR", label: "Gear" },
];

export default function CategoryPhotosPage() {
  const [images, setImages] = useState({});
  const [loading, setLoading] = useState(true);
  const [uploadingKey, setUploadingKey] = useState(null);
  const [error, setError] = useState("");
  const [savedKey, setSavedKey] = useState(null);

  useEffect(() => {
    fetch("/api/admin/category-images")
      .then((res) => res.json())
      .then((data) => setImages(data))
      .finally(() => setLoading(false));
  }, []);

  async function handleUpload(category, file) {
    setUploadingKey(category);
    setError("");
    setSavedKey(null);
    try {
      const blob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/admin/upload",
      });
      const res = await fetch("/api/admin/category-images", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, url: blob.url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed.");
      setImages(data);
      setSavedKey(category);
      setTimeout(() => setSavedKey(null), 2000);
    } catch (err) {
      setError(err.message || "Upload failed. Try a smaller photo or a different format.");
    } finally {
      setUploadingKey(null);
    }
  }

  async function handleRemove(category) {
    setUploadingKey(category);
    setError("");
    try {
      const res = await fetch("/api/admin/category-images", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, url: "" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed.");
      setImages(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploadingKey(null);
    }
  }

  return (
    <div className="admin-shell">
      <AdminTopbar />
      <div className="admin-main">
        <div className="admin-head">
          <div>
            <h1>Category photos</h1>
            <p>Pick a specific photo for each of the four homepage category tiles. Leave any category without a photo to automatically use one of that category&apos;s product photos instead.</p>
          </div>
        </div>

        {error && <div className="error-banner">{error}</div>}

        {loading ? (
          <p style={{ color: "var(--text-secondary)" }}>Loading…</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 560 }}>
            {CATEGORIES.map(({ key, label }) => (
              <div key={key} className="admin-form-card" style={{ maxWidth: "none" }}>
                <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={images[key] || "/images/products/_placeholder.jpg"}
                    alt=""
                    style={{ width: 90, height: 110, objectFit: "cover", borderRadius: 4, border: "1px solid var(--border-strong)", background: "var(--surface)" }}
                  />
                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", fontFamily: "var(--font-display)", fontSize: 17, marginBottom: 8 }}>{label}</label>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      disabled={uploadingKey === key}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleUpload(key, file);
                        e.target.value = "";
                      }}
                    />
                    {uploadingKey === key && <p className="field-hint">Uploading…</p>}
                    {savedKey === key && <p className="field-hint" style={{ color: "var(--accent-primary)" }}>Saved.</p>}
                    {images[key] && uploadingKey !== key && (
                      <div style={{ marginTop: 10 }}>
                        <button type="button" className="btn btn-outline" style={{ padding: "8px 14px", fontSize: 11.5 }} onClick={() => handleRemove(key)}>
                          REMOVE PHOTO
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
