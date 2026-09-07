import { notFound } from "next/navigation";
import AdminTopbar from "@/components/admin/AdminTopbar";
import ProductForm from "@/components/admin/ProductForm";
import { getProduct } from "@/lib/db";

export const revalidate = 0;

export const metadata = {
  title: "Edit Product — Friction Point Admin",
  robots: { index: false },
};

export default async function EditProductPage({ params }) {
  const product = await getProduct(params.id);
  if (!product) notFound();

  return (
    <div className="admin-shell">
      <AdminTopbar />
      <div className="admin-main">
        <div className="admin-head">
          <div>
            <h1>Edit product</h1>
            <p>Changes go live immediately across the whole site.</p>
          </div>
        </div>
        <ProductForm initialProduct={product} />
      </div>
    </div>
  );
}
