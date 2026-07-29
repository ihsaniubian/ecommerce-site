"use client";

import { useState } from "react";
import Image from "next/image";

const CATEGORIES = ["Men", "Women", "Kids", "Home", "Electronics", "Beauty"];

export default function AddProductPage() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    compareAtPrice: "",
    category: CATEGORIES[0],
    brand: "",
    sizes: "",
    colors: "",
    stock: "",
    sku: "",
    isFeatured: false,
  });
  const [images, setImages] = useState([]);
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

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (images.length === 0) {
      setError("Please upload at least one product image");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
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
      if (!res.ok) throw new Error(data.error || "Could not create product");

      setSuccess(`"${data.product.name}" was added successfully.`);
      setForm({
        name: "", description: "", price: "", compareAtPrice: "", category: CATEGORIES[0],
        brand: "", sizes: "", colors: "", stock: "", sku: "", isFeatured: false,
      });
      setImages([]);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold">Add Product</h1>

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
            placeholder="Compare-at Price (optional, for sale badge)"
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
            placeholder="Sizes, comma separated (e.g. S, M, L)"
            value={form.sizes}
            onChange={(e) => setForm({ ...form, sizes: e.target.value })}
            className="input-field"
          />
          <input
            placeholder="Colors, comma separated (e.g. Red, Black)"
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

        <div>
          <label className="mb-1.5 block text-sm font-semibold">Product Images</label>
          <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="text-sm" />
          {uploading && <p className="mt-1 text-sm text-ink/50">Uploading...</p>}
          {images.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {images.map((img, i) => (
                <div key={img} className="relative h-16 w-16 overflow-hidden rounded-sm border border-ink/10">
                  <Image src={img} alt="" fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {error && <p className="text-sm text-brick">{error}</p>}
        {success && <p className="text-sm text-teal">{success}</p>}

        <button type="submit" disabled={submitting || uploading} className="btn-primary">
          {submitting ? "Saving..." : "Add Product"}
        </button>
      </form>
    </div>
  );
}
