"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import ProductCard from "@/components/ProductCard";

export default function WishlistPage() {
  const { user, loading } = useAuth();
  const [products, setProducts] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetch("/api/wishlist")
      .then((res) => res.json())
      .then((data) => setProducts(data.products || []))
      .finally(() => setFetching(false));
  }, [user]);

  if (!loading && !user) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Please log in</h1>
        <a href="/login" className="btn-primary mt-6 inline-flex">Log In</a>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">My Wishlist</h1>
      {fetching ? (
        <p className="text-ink/50">Loading...</p>
      ) : products.length === 0 ? (
        <p className="text-ink/50">Your wishlist is empty. Tap the heart on any product to save it here.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
