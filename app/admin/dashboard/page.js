import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import Order from "@/models/Order";

export default async function AdminDashboard() {
  await connectDB();

  const [productCount, orderCount, lowStock, orders] = await Promise.all([
    Product.countDocuments(),
    Order.countDocuments(),
    Product.find({ stock: { $lte: 5 }, isActive: true }).select("name stock").limit(10).lean(),
    Order.find().select("grandTotal status createdAt").lean(),
  ]);

  const totalSales = orders.reduce((sum, o) => sum + o.grandTotal, 0);
  const pendingOrders = orders.filter((o) => o.status === "pending").length;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        <StatCard label="Total Sales" value={`Rs. ${totalSales.toLocaleString()}`} />
        <StatCard label="Total Orders" value={orderCount} />
        <StatCard label="Pending Orders" value={pendingOrders} />
        <StatCard label="Products Listed" value={productCount} />
      </div>

      <div className="mt-8 rounded-sm border border-ink/10 bg-white p-5">
        <h2 className="mb-3 font-semibold">Low Stock Alerts</h2>
        {lowStock.length === 0 ? (
          <p className="text-sm text-ink/50">All products are well stocked.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {lowStock.map((p) => (
              <li key={p._id.toString()} className="flex justify-between border-b border-ink/5 pb-2">
                <span>{p.name}</span>
                <span className="font-semibold text-brick">{p.stock} left</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-sm border border-ink/10 bg-white p-4">
      <p className="text-xs text-ink/50">{label}</p>
      <p className="mt-1 font-mono text-xl font-bold text-teal">{value}</p>
    </div>
  );
}
