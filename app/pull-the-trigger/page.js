import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FilterableGrid from "@/components/FilterableGrid";
import { getAllProducts } from "@/lib/db";
import { pullTheTrigger, sortByDateDesc } from "@/lib/products";

export const revalidate = 0;

export const metadata = {
  title: "Pull the Trigger",
  description: "Friction Point's highest-conviction gear recommendations. Not everything makes the cut.",
  alternates: { canonical: "/pull-the-trigger" },
};

export default async function PullTheTriggerPage() {
  const products = await getAllProducts();
  const picks = sortByDateDesc(pullTheTrigger(products));

  return (
    <>
      <Header products={products} />
      <main id="main">
        <div className="page-head">
          <div className="container">
            <div className="eyebrow">PULL THE TRIGGER</div>
            <h1>Our highest-conviction gear recommendations.</h1>
            <p>Not everything makes the cut. These are the products we&apos;d have no problem recommending to a friend.</p>
          </div>
        </div>
        <div className="section">
          <div className="container">
            <FilterableGrid
              products={picks}
              filterKey="category"
              emptyMessage="No Pull the Trigger picks yet."
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
