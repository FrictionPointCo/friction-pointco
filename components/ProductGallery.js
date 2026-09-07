"use client";

import { useState } from "react";

export default function ProductGallery({ images, alt }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const photos = images.length ? images : ["/images/products/_placeholder.jpg"];

  return (
    <div>
      <div className="product-detail__media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photos[activeIndex]}
          alt={alt}
          onError={(e) => { e.currentTarget.src = "/images/products/_placeholder.jpg"; }}
        />
      </div>
      {photos.length > 1 && (
        <div className="product-gallery__thumbs">
          {photos.map((src, i) => (
            <button
              key={src + i}
              className={`product-gallery__thumb ${i === activeIndex ? "is-active" : ""}`}
              onClick={() => setActiveIndex(i)}
              aria-label={`Show photo ${i + 1} of ${photos.length}`}
              aria-current={i === activeIndex}
              type="button"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt=""
                onError={(e) => { e.currentTarget.src = "/images/products/_placeholder.jpg"; }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
