"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const CATEGORY_OPTIONS = ["EDC", "KNIVES", "RANGE", "GEAR"];

const BLANK = {
  id: "",
  name: "",
  brand: "",
  category: "EDC",
  subcategory: "",
  image: "",
  shortDescription: "",
  description: "",
  why: "",
  affiliateUrl: "",
  retailer: "",
  price: "",
  featured: false,
  pullTheTrigger: false,
  dateAdded: new Date().toISOString().slice(0, 10),
  tags: "",
  instagramUrl: "",
};

export default function ProductForm({ initialProduct = null }) {
  const router = useRouter();
  const isEdit = Boolean(initialProduct);
  const [form, setForm] = useState(() =>
    initialProduct
      ? { ...BLANK, ...initialProduct, tags: (initialProduct.tags || []).join(", ") }
      : BLANK
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const url = isEdit ? `/api/products/${initialProduct.id}` : "/api/products";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  return (
    <form className="admin-form-card" onSubmit={handleSubmit}>
      {error && <div className="error-banner">{error}</div>}

      {!isEdit && (
        <div className="field">
          <label htmlFor="id">URL slug (optional — auto-generated from brand + name if left blank)</label>
          <input id="id" type="text" value={form.id} onChange={(e) => update("id", e.target.value)} placeholder="e.g. benchmade-bugout" />
          <p className="field-hint">Lowercase letters, numbers, and hyphens only. This becomes /product/your-slug.</p>
        </div>
      )}

      <div className="field-row">
        <div className="field">
          <label htmlFor="name">Product name</label>
          <input id="name" type="text" required value={form.name} onChange={(e) => update("name", e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="brand">Brand</label>
          <input id="brand" type="text" required value={form.brand} onChange={(e) => update("brand", e.target.value)} />
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="category">Category</label>
          <select id="category" value={form.category} onChange={(e) => update("category", e.target.value)}>
            {CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="subcategory">Subcategory (optional)</label>
          <input id="subcategory" type="text" value={form.subcategory} onChange={(e) => update("subcategory", e.target.value)} placeholder="e.g. Folding, Lights, Bags" />
        </div>
      </div>

      <div className="field">
        <label htmlFor="image">Image URL</label>
        <input id="image" type="text" value={form.image} onChange={(e) => update("image", e.target.value)} placeholder="/images/products/your-photo.jpg or a full https:// URL" />
      </div>

      <div className="field">
        <label htmlFor="shortDescription">Short description (shows on product cards)</label>
        <input id="shortDescription" type="text" value={form.shortDescription} onChange={(e) => update("shortDescription", e.target.value)} />
      </div>

      <div className="field">
        <label htmlFor="description">Full description (shows on the product page)</label>
        <textarea id="description" value={form.description} onChange={(e) => update("description", e.target.value)} />
      </div>

      <div className="field">
        <label htmlFor="why">Why it made the cut</label>
        <textarea id="why" value={form.why} onChange={(e) => update("why", e.target.value)} />
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="retailer">Retailer</label>
          <input id="retailer" type="text" value={form.retailer} onChange={(e) => update("retailer", e.target.value)} placeholder="e.g. Amazon" />
        </div>
        <div className="field">
          <label htmlFor="price">Price (optional)</label>
          <input id="price" type="text" value={form.price} onChange={(e) => update("price", e.target.value)} placeholder="Leave blank — prices go stale fast" />
        </div>
      </div>

      <div className="field">
        <label htmlFor="affiliateUrl">Affiliate / retailer URL</label>
        <input id="affiliateUrl" type="text" value={form.affiliateUrl} onChange={(e) => update("affiliateUrl", e.target.value)} placeholder="https://..." />
        <p className="field-hint">Leave blank to show &quot;Link coming soon&quot; on the product page instead of a broken link.</p>
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="dateAdded">Date added</label>
          <input id="dateAdded" type="date" value={form.dateAdded} onChange={(e) => update("dateAdded", e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="tags">Tags (comma separated)</label>
          <input id="tags" type="text" value={form.tags} onChange={(e) => update("tags", e.target.value)} placeholder="flashlight, rechargeable, keychain" />
        </div>
      </div>

      <div className="field-row" style={{ marginBottom: 24 }}>
        <div className="field-check">
          <input id="featured" type="checkbox" checked={form.featured} onChange={(e) => update("featured", e.target.checked)} />
          <label htmlFor="featured">Featured on homepage</label>
        </div>
        <div className="field-check">
          <input id="pullTheTrigger" type="checkbox" checked={form.pullTheTrigger} onChange={(e) => update("pullTheTrigger", e.target.checked)} />
          <label htmlFor="pullTheTrigger">Pull the Trigger</label>
        </div>
      </div>

      <div className="admin-form-actions">
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? "SAVING…" : isEdit ? "SAVE CHANGES" : "ADD PRODUCT"}
        </button>
        <button type="button" className="btn btn-outline" onClick={() => router.push("/admin")} disabled={saving}>
          CANCEL
        </button>
      </div>
    </form>
  );
}
