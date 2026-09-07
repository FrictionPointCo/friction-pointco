import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getAllProducts } from "@/lib/db";

export const revalidate = 0;

export const metadata = {
  title: "About",
  description: "Friction Point exists to cut through the endless noise of gear recommendations and highlight products actually worth carrying.",
  alternates: { canonical: "/about" },
};

export default async function AboutPage() {
  const products = await getAllProducts();
  return (
    <>
      <Header products={products} />
      <main id="main">
        <div className="container">
          <article className="prose">
            <h1>About Friction Point</h1>
            <p>Friction Point exists to cut through the endless noise of gear recommendations and highlight products actually worth carrying.</p>
            <p>There&apos;s no shortage of &quot;best of&quot; lists online. Most of them are written to fill a template, not to tell you the truth about a product. We do the opposite: every knife, light, tool, and bag on this site is here because we&apos;d carry it ourselves, not because it pays the best commission.</p>
            <h2>What we cover</h2>
            <p>Knives. EDC. Range gear. Everyday equipment. The stuff that ends up in a pocket, a bag, or a range kit and actually gets used, week after week.</p>
            <h2>Independent curation</h2>
            <p>We&apos;re not sponsored by the brands we feature. When something earns our <strong>Pull the Trigger</strong> designation, it&apos;s because it held up to real-world use, not because of a partnership.</p>
            <h2>Real-world usefulness</h2>
            <p>Specs matter less than whether something works the way it&apos;s supposed to, every time. That&apos;s the bar every product on this site has to clear.</p>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
