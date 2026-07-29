import Link from "next/link";

export default function AdminLayout({ children }) {
  return (
    <div className="mx-auto flex max-w-7xl gap-8 px-4 py-8">
      <aside className="w-48 shrink-0 space-y-1 text-sm">
        <p className="mb-3 font-display text-xl font-bold text-teal">Admin Panel</p>
        <Link href="/admin/dashboard" className="block rounded-sm px-3 py-2 hover:bg-teal/5">Dashboard</Link>
        <Link href="/admin/products" className="block rounded-sm px-3 py-2 hover:bg-teal/5">Products</Link>
        <Link href="/admin/products/add" className="block rounded-sm px-3 py-2 hover:bg-teal/5">Add Product</Link>
        <Link href="/admin/orders" className="block rounded-sm px-3 py-2 hover:bg-teal/5">Orders</Link>
        <Link href="/" className="block rounded-sm px-3 py-2 text-ink/50 hover:bg-teal/5">← Back to Store</Link>
      </aside>
      <div className="flex-1">{children}</div>
    </div>
  );
}
