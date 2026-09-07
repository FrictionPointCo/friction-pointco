import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getAllProducts } from "@/lib/db";

export const revalidate = 0;

export const metadata = {
  title: "Privacy Policy",
  description: "Friction Point's privacy policy.",
  alternates: { canonical: "/privacy" },
};

export default async function PrivacyPage() {
  const products = await getAllProducts();
  return (
    <>
      <Header products={products} />
      <main id="main">
        <div className="container">
          <article className="prose">
            <h1>Privacy Policy</h1>
            <p>This policy explains what information Friction Point collects and how it&apos;s used. Replace this placeholder with your actual practices before launch, especially once analytics or an email list are added.</p>
            <h2>Information we collect</h2>
            <p>Basic, non-identifying analytics data (pages visited, general location, device type) may be collected to understand how the site is used. Friction Point does not sell personal information.</p>
            <h2>Cookies</h2>
            <p>The site uses one functional cookie for the admin dashboard&apos;s login session. It is not used for tracking visitors. Analytics tools added later may use their own cookies—disclose those here when you add them.</p>
            <h2>Third-party links</h2>
            <p>Product pages link to third-party retailers. Those sites have their own privacy policies, and Friction Point isn&apos;t responsible for their practices.</p>
            <h2>Contact</h2>
            <p>Questions about this policy can be sent through the <Link href="/contact">contact page</Link>.</p>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
