import Link from "next/link";
import Header, { INSTAGRAM_URL } from "@/components/Header";
import Footer from "@/components/Footer";
import Badge from "@/components/Badge";
import ProductCard from "@/components/ProductCard";
import EmptyState from "@/components/EmptyState";
import { getAllProducts } from "@/lib/db";
import { featured as getFeatured, pullTheTrigger, latest, sortByDateDesc, categoryThumbnail } from "@/lib/products";

export const revalidate = 0; // always read fresh from the database

export default async function HomePage() {
  const products = await getAllProducts();
  const featuredProduct = getFeatured(products);
  const pttPreview = sortByDateDesc(pullTheTrigger(products)).slice(0, 4);
  const latestGear = latest(products, 8);
  const categoryPhotos = {
    EDC: categoryThumbnail(products, "EDC"),
    KNIVES: categoryThumbnail(products, "KNIVES"),
    RANGE: categoryThumbnail(products, "RANGE"),
    GEAR: categoryThumbnail(products, "GEAR"),
  };

  return (
    <>
      <Header products={products} />
      <main id="main">
        <section className="hero">
          <div className="container hero__inner">
            <h1>FRICTION POINT<span className="tagline">Trust what you carry.</span></h1>
            <p className="sub">Knives, EDC, range gear and everyday equipment—curated without the noise.</p>
            <div className="hero__ctas">
              <Link className="btn btn-primary" href=#categories">EXPLORE THE GEAR</Link>
              <Link className="btn btn-outline" href="/pull-the-trigger">PULL THE TRIGGER</Link>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-head">
              <div>
                <div className="eyebrow">LATEST PULL THE TRIGGER</div>
                <h2>Our newest high-conviction pick</h2>
              </div>
            </div>
            {featuredProduct ? (
              <div className="featured">
                <div className="featured__media">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={featuredProduct.image || "/images/products/_placeholder.jpg"} alt={`${featuredProduct.brand} ${featuredProduct.name}`} />
                </div>
                <div className="featured__body">
                  {featuredProduct.pullTheTrigger && <Badge />}
                  <div className="featured__brand">{featuredProduct.brand}</div>
                  <h3>{featuredProduct.name}</h3>
                  <p className="short">{featuredProduct.shortDescription}</p>
                  <div className="featured__why">
                    <div className="label">Why we like it</div>
                    <p>{featuredProduct.why}</p>
                  </div>
                  <Link className="btn btn-primary" href={`/product/${featuredProduct.id}`} data-analytics="product_click" data-product-id={featuredProduct.id}>VIEW PRODUCT</Link>
                </div>
              </div>
            ) : (
              <EmptyState message='No featured product yet. Set "featured" on a product in the admin dashboard.' />
            )}
          </div>
        </section>

        <section className="section" id="categories">
          <div className="container">
            <div className="section-head">
              <div>
                <h2>Shop by category</h2>
                <p>Four categories. No clutter. Everything else lives in Gear.</p>
              </div>
            </div>
            <div className="category-grid">
              <Link className={`category-card ${!categoryPhotos.EDC ? "category-card--plain" : ""}`} href="/edc" data-analytics="category_click" data-category="EDC">
                {categoryPhotos.EDC && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={categoryPhotos.EDC} alt="EDC gear" />
                )}
                <div className="category-card__overlay"><h3>EDC</h3><p>Everyday carry essentials.</p></div>
              </Link>
              <Link className={`category-card ${!categoryPhotos.KNIVES ? "category-card--plain" : ""}`} href="/knives" data-analytics="category_click" data-category="KNIVES">
                {categoryPhotos.KNIVES && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={categoryPhotos.KNIVES} alt="Knives" />
                )}
                <div className="category-card__overlay"><h3>Knives</h3><p>Folding, fixed blade &amp; cutting tools.</p></div>
              </Link>
              <Link className={`category-card ${!categoryPhotos.RANGE ? "category-card--plain" : ""}`} href="/range" data-analytics="category_click" data-category="RANGE">
                {categoryPhotos.RANGE && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={categoryPhotos.RANGE} alt="Range gear" />
                )}
                <div className="category-card__overlay"><h3>Range</h3><p>Accessories &amp; shooting gear.</p></div>
              </Link>
              <Link className={`category-card ${!categoryPhotos.GEAR ? "category-card--plain" : ""}`} href="/gear" data-analytics="category_click" data-category="GEAR">
                {categoryPhotos.GEAR && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={categoryPhotos.GEAR} alt="General gear" />
                )}
                <div className="category-card__overlay"><h3>Gear</h3><p>Bags, tools &amp; everything else.</p></div>
              </Link>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-head">
              <div>
                <div className="eyebrow">PULL THE TRIGGER</div>
                <h2>Gear we wouldn&apos;t hesitate to recommend</h2>
                <p>Not everything makes the cut. These are the products we&apos;d have no problem recommending to a friend.</p>
              </div>
              <Link className="link-more" href="/pull-the-trigger">VIEW ALL &rarr;</Link>
            </div>
            <div className="product-grid">
              {pttPreview.length
                ? pttPreview.map((p) => <ProductCard key={p.id} product={p} />)
                : <EmptyState message="No Pull the Trigger picks yet." />}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-head">
              <div>
                <h2>Latest gear</h2>
                <p>Newest additions to Friction Point, automatically sorted.</p>
              </div>
            </div>
            <div className="product-grid">
              {latestGear.length
                ? latestGear.map((p) => <ProductCard key={p.id} product={p} />)
                : <EmptyState message="No products yet. Add one from the admin dashboard." />}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="insta-simple">
              <h2>Follow Friction Point</h2>
              <p>Gear, EDC, knives and the occasional bad decision.</p>
              <a className="btn btn-primary" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">FOLLOW ON INSTAGRAM</a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
