import AdminTopbar from "@/components/admin/AdminTopbar";
import ProductForm from "@/components/admin/ProductForm";

export const metadata = {
  title: "Add Product — Friction Point Admin",
  robots: { index: false },
};

export default function NewProductPage() {
  return (
    <div className="admin-shell">
      <AdminTopbar />
      <div className="admin-main">
        <div className="admin-head">
          <div>
            <h1>Add product</h1>
            <p>This appears on its category page, Latest Gear, and Pull the Trigger (if checked) automatically.</p>
          </div>
        </div>
        <ProductForm />
      </div>
    </div>
  );
}
