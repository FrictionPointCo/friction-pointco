import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Lost Your Point?",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <>
      <Header products={[]} />
      <main id="main">
        <div className="error-page">
          <div className="code">404</div>
          <h1>Lost your point?</h1>
          <p>The gear is around here somewhere.</p>
          <Link className="btn btn-primary" href="/">BACK TO GEAR</Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
