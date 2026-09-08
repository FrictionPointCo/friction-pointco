import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getAllProducts } from "@/lib/db";

export const revalidate = 0;

export const metadata = {
  title: "Contact",
  description: "Get in touch with Friction Point.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const products = await getAllProducts();
  return (
    <>
      <Header products={products} />
      <main id="main">
        <div className="container">
          <article className="prose">
            <h1>Contact</h1>
            <p>Questions about a product, a partnership inquiry, or something we got wrong? Reach out.</p>
            <p><strong>Email:</strong> frictionpointco@protonmail.com</p>
            <p><strong>Instagram:</strong> <a href="https://instagram.com/Frictionpointco" target="_blank" rel="noopener noreferrer">@Frictionpointco</a></p>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
