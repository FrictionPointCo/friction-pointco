import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getAllProducts } from "@/lib/db";

export const revalidate = 0;

export const metadata = {
  title: "Terms",
  description: "Terms of use for Friction Point.",
  alternates: { canonical: "/terms" },
};

export default async function TermsPage() {
  const products = await getAllProducts();
  return (
    <>
      <Header products={products} />
      <main id="main">
        <div className="container">
          <article className="prose">
            <h1>Terms of Use</h1>
            <p>By using Friction Point, you agree to these terms. Replace this placeholder with real legal terms reviewed by a professional before launch.</p>
            <h2>Content</h2>
            <p>Product information is provided for general informational purposes. Prices, availability, and specifications are controlled by third-party retailers and may change without notice.</p>
            <h2>No guarantees</h2>
            <p>Friction Point makes reasonable efforts to recommend gear accurately, but does not guarantee that any product will meet your specific needs.</p>
            <h2>Changes</h2>
            <p>These terms may be updated periodically. Continued use of the site after changes constitutes acceptance of the new terms.</p>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
