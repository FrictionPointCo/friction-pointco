import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FilterableGrid from "@/components/FilterableGrid";
import { getAllProducts } from "@/lib/db";
import { byCategory, CATEGORIES } from "@/lib/products";

export const revalidate = 0;

export function generateStaticParams() {
  return Object.keys(CATEGORIES).map((key) => ({ category: key.toLowerCase() }));
}

export async function generateMetadata({ params }) {
  const key = params.category.toUpperCase();
  const info = CATEGORIES[key];
  if (!info) return {};
  return {
    title: info.title,
    description: info.desc,
    alternates: { canonical: `/${params.category}` },
    openGraph: { title: `${info.title} | Friction Point`, description: info.desc },
  };
}

export default async function CategoryPage({ params }) {
  const key = params.category.toUpperCase();
  const info = CATEGORIES[key];
  if (!info) notFound();

  const products = await getAllProducts();
  const categoryProducts = byCategory(products, key);

  return (
    <>
      <Header products={products} />
      <main id="main">
        <div className="page-head">
          <div className="container">
            <h1>{info.title}</h1>
            <p>{info.desc}</p>
          </div>
        </div>
        <div className="section">
          <div className="container">
            <FilterableGrid
              products={categoryProducts}
              filterKey="subcategory"
              emptyMessage="No products in this filter yet."
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
