import Link from "next/link";
import AdminTopbar from "@/components/admin/AdminTopbar";
import ProductTable from "@/components/admin/ProductTable";
import { getAllProducts } from "@/lib/db";
import { sortByDateDesc } from "@/lib/products";

export const revalidate = 0;

export const metadata = {
  title: "Admin — Friction Point",
  robots: { index: false },
};

export default async function AdminDashboard() {
  const products = sortByDateDesc(await getAllProducts());

  return (
    <div className="admin-shell">
      <AdminTopbar />
      <div className="admin-main">
        <div className="admin-head">
          <div>
            <h1>Products</h1>
            <p>{products.length} product{products.length === 1 ? "" : "s"} · add, edit, delete, or toggle Featured / Pull the Trigger below.</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Link className="btn btn-outline" href="/admin/categories">CATEGORY PHOTOS</Link>
            <Link className="btn btn-primary" href="/admin/new">ADD PRODUCT</Link>
          </div>
        </div>
        <ProductTable products={products} />
      </div>
    </div>
  );
}
