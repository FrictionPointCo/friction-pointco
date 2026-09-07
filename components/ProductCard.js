"use client";

import Link from "next/link";
import Badge from "./Badge";

export default function ProductCard({ product }) {
  return (
    <Link
      className="product-card"
      href={`/product/${product.id}`}
      data-analytics="product_click"
      data-product-id={product.id}
      data-category={product.category}
    >
      <div className="product-card__media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image || "/images/products/_placeholder.jpg"}
          alt={`${product.brand} ${product.name}`}
          loading="lazy"
          onError={(e) => { e.currentTarget.src = "/images/products/_placeholder.jpg"; }}
        />
        {product.pullTheTrigger && (
          <div className="product-card__badge"><Badge /></div>
        )}
      </div>
      <div className="product-card__body">
        <div className="product-card__brand">{product.brand}</div>
        <div className="product-card__name">{product.name}</div>
        <p className="product-card__desc">{product.shortDescription}</p>
        <div className="product-card__foot">
          <span className="product-card__view">VIEW</span>
        </div>
      </div>
    </Link>
  );
}
