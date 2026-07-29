import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import ProductsTable from "@/components/admin/ProductsTable";

export default async function AdminProductsPage({ searchParams }) {
  const { search } = await searchParams;
  await connectDB();

  const query = {};
  if (search) query.$text = { $search: search };

  const products = await Product.find(query).sort({ createdAt: -1 }).lean();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products ({products.length})</h1>
        <a href="/admin/products/add" className="btn-primary !py-2 text-sm">+ Add Product</a>
      </div>

      <form className="mb-4">
        <input
          type="search"
          name="search"
          defaultValue={search || ""}
          placeholder="Search products..."
          className="input-field max-w-sm"
        />
      </form>

      <ProductsTable products={JSON.parse(JSON.stringify(products))} />
    </div>
  );
}
