"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const CATEGORIES = ["Men", "Women", "Kids", "Home", "Electronics", "Beauty"];

export default function EditProductClient({ product }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: product.name,
    description: product.description,
    price: product.price,
    compareAtPrice: product.compareAtPrice || "",
    category: product.category,
    brand: product.brand || "",
    sizes: (product.sizes || []).join(", "),
    colors: (product.colors || []).join(", "),
    stock: product.stock,
    sku: product.sku || "",
    isFeatured: product.isFeatured,
    isActive: product.isActive,
  });
  const [images, setImages] = useState(product.images || []);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleImageUpload(e) {
    const files = Array.from(e.target.files);
    setUploading(true);
    setError("");
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed");
        setImages((prev) => [...prev, data.url]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  function removeImage(url) {
    setImages((prev) => prev.filter((img) => img !== url));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (images.length === 0) {
      setError("Product must have at least one image");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/products/${product._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : undefined,
          stock: Number(form.stock),
          sizes: form.sizes ? form.sizes.split(",").map((s) => s.trim()).filter(Boolean) : [],
          colors: form.colors ? form.colors.split(",").map((c) => c.trim()).filter(Boolean) : [],
          images,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not update product");
      setSuccess("Product updated successfully.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/products/${product._id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not delete product");
      router.push("/admin/products");
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Edit Product</h1>
        <button onClick={handleDelete} disabled={submitting} className="text-sm text-brick hover:underline">
          Delete Product
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          required
          placeholder="Product Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="input-field"
        />
        <textarea
          required
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="input-field"
          rows={4}
        />

        <div className="grid grid-cols-2 gap-3">
          <input
            required
            type="number"
            placeholder="Price (Rs.)"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="input-field"
          />
          <input
            type="number"
            placeholder="Compare-at Price (optional)"
            value={form.compareAtPrice}
            onChange={(e) => setForm({ ...form, compareAtPrice: e.target.value })}
            className="input-field"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="input-field"
          >
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <input
            placeholder="Brand (optional)"
            value={form.brand}
            onChange={(e) => setForm({ ...form, brand: e.target.value })}
            className="input-field"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <input
            placeholder="Sizes, comma separated"
            value={form.sizes}
            onChange={(e) => setForm({ ...form, sizes: e.target.value })}
            className="input-field"
          />
          <input
            placeholder="Colors, comma separated"
            value={form.colors}
            onChange={(e) => setForm({ ...form, colors: e.target.value })}
            className="input-field"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <input
            required
            type="number"
            placeholder="Stock Quantity"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            className="input-field"
          />
          <input
            placeholder="SKU (optional)"
            value={form.sku}
            onChange={(e) => setForm({ ...form, sku: e.target.value })}
            className="input-field"
          />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.isFeatured}
            onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
          />
          Show in Featured Picks on homepage
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
          />
          Active (visible in store — uncheck to hide without deleting)
        </label>

        <div>
          <label className="mb-1.5 block text-sm font-semibold">Product Images</label>
          <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="text-sm" />
          {uploading && <p className="mt-1 text-sm text-ink/50">Uploading...</p>}
          {images.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {images.map((img) => (
                <div key={img} className="group relative h-16 w-16 overflow-hidden rounded-sm border border-ink/10">
                  <Image src={img} alt="" fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(img)}
                    className="absolute inset-0 hidden items-center justify-center bg-ink/60 text-xs font-bold text-canvas group-hover:flex"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {error && <p className="text-sm text-brick">{error}</p>}
        {success && <p className="text-sm text-teal">{success}</p>}

        <div className="flex gap-3">
          <button type="submit" disabled={submitting || uploading} className="btn-primary">
            {submitting ? "Saving..." : "Save Changes"}
          </button>
          <a href="/admin/products" className="btn-secondary">Back to Products</a>
        </div>
      </form>
    </div>
  );
}
