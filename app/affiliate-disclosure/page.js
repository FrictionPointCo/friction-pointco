import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getAllProducts } from "@/lib/db";

export const revalidate = 0;

export const metadata = {
  title: "Affiliate Disclosure",
  description: "How Friction Point earns money and why it doesn't change our recommendations.",
  alternates: { canonical: "/affiliate-disclosure" },
};

export default async function AffiliateDisclosurePage() {
  const products = await getAllProducts();
  return (
    <>
      <Header products={products} />
      <main id="main">
        <div className="container">
          <article className="prose">
            <h1>Affiliate Disclosure</h1>
            <p>Friction Point may earn a commission when you buy something through a link on this site. This comes at no extra cost to you—the price is the same whether you click through us or find the product yourself.</p>
            <p>Commissions help fund the time it takes to research, test, and write about gear. They do not influence which products get featured, which ones earn a <strong>Pull the Trigger</strong> designation, or what we say about them. If something isn&apos;t good, we say so, commission or not.</p>
            <h2>How this works</h2>
            <p>Product pages link out to retailers like Amazon, manufacturer sites, and other authorized sellers. Some of these links are affiliate links, meaning we&apos;re compensated for referring the sale. We identify this relationship on every product page.</p>
            <h2>Questions</h2>
            <p>If you have questions about a specific recommendation or this disclosure, <Link href="/contact">reach out</Link>.</p>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
