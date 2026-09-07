"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProductTable({ products }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");

  async function toggleFlag(product, flag) {
    setBusyId(product.id);
    setError("");
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...product, [flag]: !product[flag] }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Update failed.");
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(product) {
    if (!window.confirm(`Delete "${product.name}"? This can't be undone.`)) return;
    setBusyId(product.id);
    setError("");
    try {
      const res = await fetch(`/api/products/${product.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error((await res.json()).error || "Delete failed.");
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  if (!products.length) {
    return <div className="admin-empty">No products yet. Click &quot;Add Product&quot; to create your first one.</div>;
  }

  return (
    <>
      {error && <div className="error-banner">{error}</div>}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Brand</th>
              <th>Category</th>
              <th>Featured</th>
              <th>Pull the Trigger</th>
              <th>Added</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} style={{ opacity: busyId === p.id ? 0.5 : 1 }}>
                <td>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="thumb" src={p.image || "/images/products/_placeholder.jpg"} alt="" />
                </td>
                <td>{p.name}</td>
                <td>{p.brand}</td>
                <td>{p.category}</td>
                <td className="checkbox-cell">
                  <input
                    type="checkbox"
                    checked={Boolean(p.featured)}
                    disabled={busyId === p.id}
                    onChange={() => toggleFlag(p, "featured")}
                    aria-label={`Toggle featured for ${p.name}`}
                  />
                </td>
                <td className="checkbox-cell">
                  <input
                    type="checkbox"
                    checked={Boolean(p.pullTheTrigger)}
                    disabled={busyId === p.id}
                    onChange={() => toggleFlag(p, "pullTheTrigger")}
                    aria-label={`Toggle Pull the Trigger for ${p.name}`}
                  />
                </td>
                <td>{p.dateAdded}</td>
                <td>
                  <div className="row-actions">
                    <Link href={`/admin/${p.id}/edit`}>EDIT</Link>
                    <button className="danger" disabled={busyId === p.id} onClick={() => handleDelete(p)}>DELETE</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
