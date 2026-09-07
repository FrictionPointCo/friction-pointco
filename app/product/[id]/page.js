import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Badge from "@/components/Badge";
import { getAllProducts, getProduct } from "@/lib/db";
import { retailerLabel } from "@/lib/products";

export const revalidate = 0;

const SITE_URL = process.env.SITE_URL || "https://frictionpoint.example.com";

export async function generateMetadata({ params }) {
  const product = await getProduct(params.id);
  if (!product) return {};
  return {
    title: `${product.name} by ${product.brand}`,
    description: product.shortDescription,
    alternates: { canonical: `/product/${product.id}` },
    openGraph: {
      title: `${product.name} by ${product.brand} | Friction Point`,
      description: product.shortDescription,
      images: [product.image || "/images/products/_placeholder.jpg"],
      type: "website",
    },
  };
}

export default async function ProductPage({ params }) {
  const product = await getProduct(params.id);
  if (!product) notFound();

  const allProducts = await getAllProducts();
  const categoryLower = product.category.toLowerCase();
  const hasLink = Boolean(product.affiliateUrl);

  return (
    <>
      <Header products={allProducts} activeOverride={`/${categoryLower}`} />
      <main id="main">
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              name: product.name,
              brand: { "@type": "Brand", name: product.brand },
              description: product.shortDescription,
              image: `${SITE_URL}${product.image || "/images/products/_placeholder.jpg"}`,
              category: product.category,
              offers: {
                "@type": "Offer",
                url: product.affiliateUrl || `${SITE_URL}/product/${product.id}`,
                availability: "https://schema.org/InStock",
              },
            }),
          }}
        />
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link> / <Link href={`/${categoryLower}`}>{product.category}</Link> / <span>{product.name}</span>
          </nav>
          <div className="product-detail">
            <div className="product-detail__media">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={product.image || "/images/products/_placeholder.jpg"} alt={`${product.brand} ${product.name}`} />
            </div>
            <div className="product-detail__info">
              <div className="product-detail__brand">{product.brand}</div>
              <h1 className="product-detail__name">{product.name}</h1>
              <div className="product-detail__badges">
                <span className="product-detail__category-tag">{product.category}</span>
                {product.pullTheTrigger && <Badge />}
              </div>
              <p className="product-detail__short">{product.description}</p>
              <div className="product-detail__why">
                <div className="label">Why it made the cut</div>
                <p>{product.why}</p>
              </div>
              <div className="product-detail__cta">
                {hasLink ? (
                  <a
                    className="btn btn-primary"
                    href={product.affiliateUrl}
                    target="_blank"
                    rel="nofollow sponsored noopener noreferrer"
                    data-analytics="affiliate_click"
                    data-product-id={product.id}
                    data-retailer={product.retailer || ""}
                  >
                    {retailerLabel(product)}
                  </a>
                ) : (
                  <button className="btn btn-outline" disabled aria-disabled="true">LINK COMING SOON</button>
                )}
              </div>
              <p className="product-detail__disclosure">
                {hasLink
                  ? "Friction Point may earn a commission from qualifying purchases."
                  : "This product doesn't have a retailer link yet."}
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
