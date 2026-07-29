"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProductsTable({ products: initialProducts }) {
  const [products, setProducts] = useState(initialProducts);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleDelete(product) {
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return;

    setDeletingId(product._id);
    setError("");
    try {
      const res = await fetch(`/api/products/${product._id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not delete product");
      setProducts((prev) => prev.filter((p) => p._id !== product._id));
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  }

  if (products.length === 0) {
    return <p className="text-ink/50">No products found.</p>;
  }

  return (
    <div>
      {error && <p className="mb-3 text-sm text-brick">{error}</p>}
      <div className="overflow-x-auto rounded-sm border border-ink/10 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-left text-xs uppercase tracking-wide text-ink/50">
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="border-b border-ink/5 last:border-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-sm bg-ink/5">
                      {product.images?.[0] && (
                        <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                      )}
                    </div>
                    <span className="line-clamp-1 font-medium">{product.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-ink/70">{product.category}</td>
                <td className="px-4 py-3 font-mono">Rs. {product.price.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span className={product.stock <= 5 ? "font-semibold text-brick" : "text-ink/70"}>
                    {product.stock}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded-sm px-2 py-0.5 text-xs font-semibold ${
                    product.isActive ? "bg-teal/10 text-teal" : "bg-ink/5 text-ink/40"
                  }`}>
                    {product.isActive ? "Active" : "Hidden"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-3">
                    <Link href={`/admin/products/${product._id}/edit`} className="text-teal hover:underline">
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(product)}
                      disabled={deletingId === product._id}
                      className="text-brick hover:underline disabled:opacity-50"
                    >
                      {deletingId === product._id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
