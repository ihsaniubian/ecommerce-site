"use client";

export default function SortSelect({ defaultValue }) {
  return (
    <select
      name="sort"
      defaultValue={defaultValue || "newest"}
      className="input-field !w-auto text-sm"
      onChange={(e) => e.target.form.requestSubmit()}
    >
      <option value="newest">Newest</option>
      <option value="priceAsc">Price: Low to High</option>
      <option value="priceDesc">Price: High to Low</option>
      <option value="rating">Top Rated</option>
    </select>
  );
}