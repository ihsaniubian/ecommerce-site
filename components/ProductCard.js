"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import StarRating from "./StarRating";

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { user } = useAuth();
  const [wishlisted, setWishlisted] = useState(user?.wishlist?.includes(product._id));
  const hasDiscount = product.compareAtPrice > product.price;

  async function toggleWishlist() {
    if (!user) {
      window.location.href = "/login";
      return;
    }
    setWishlisted((w) => !w);
    await fetch("/api/wishlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: product._id }),
    });
  }

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-sm border border-ink/10 bg-white transition hover:shadow-md">
      <Link href={`/product/${product.slug}`} className="relative block aspect-square overflow-hidden bg-ink/5">
        {product.images?.[0] && (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        )}
        {hasDiscount && (
          <span className="absolute left-2 top-2 rounded-sm bg-brick px-2 py-0.5 text-xs font-bold text-canvas">
            SALE
          </span>
        )}
      </Link>

      <button
        onClick={toggleWishlist}
        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-lg"
      >
        {wishlisted ? "♥" : "♡"}
      </button>

      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <Link href={`/product/${product.slug}`}>
          <h3 className="line-clamp-2 text-sm font-medium text-ink">{product.name}</h3>
        </Link>

        {product.numReviews > 0 && (
          <StarRating rating={product.rating} count={product.numReviews} size="sm" />
        )}

        <div className="mt-auto flex items-baseline gap-2 pt-1">
          <span className="price-tag text-base">Rs. {product.price.toLocaleString()}</span>
          {hasDiscount && (
            <span className="font-mono text-xs text-ink/40 line-through">
              Rs. {product.compareAtPrice.toLocaleString()}
            </span>
          )}
        </div>

        <button
          onClick={() => addItem(product, { quantity: 1 })}
          disabled={product.stock < 1}
          className="btn-primary mt-2 w-full !py-2 text-xs disabled:cursor-not-allowed disabled:opacity-40"
        >
          {product.stock < 1 ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
