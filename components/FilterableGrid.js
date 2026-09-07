"use client";

import { useState, useMemo } from "react";
import ProductCard from "./ProductCard";
import EmptyState from "./EmptyState";

/**
 * filterKey: which product field the chips filter on ("subcategory" or "category")
 * emptyMessage: shown when the filtered list is empty
 */
export default function FilterableGrid({ products, filterKey = "subcategory", emptyMessage = "No products yet." }) {
  const options = useMemo(
    () => [...new Set(products.map((p) => p[filterKey]).filter(Boolean))],
    [products, filterKey]
  );
  const [active, setActive] = useState("");

  const filtered = active ? products.filter((p) => p[filterKey] === active) : products;

  return (
    <>
      {options.length > 1 && (
        <div className="filter-bar">
          <button className={`filter-chip ${active === "" ? "is-active" : ""}`} onClick={() => setActive("")}>
            All
          </button>
          {options.map((opt) => (
            <button
              key={opt}
              className={`filter-chip ${active === opt ? "is-active" : ""}`}
              onClick={() => setActive(opt)}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
      <div className="product-grid">
        {filtered.length
          ? filtered.map((p) => <ProductCard key={p.id} product={p} />)
          : <EmptyState message={emptyMessage} />}
      </div>
    </>
  );
}
