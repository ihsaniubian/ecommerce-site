"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import StarRating from "./StarRating";

export default function ProductDetailClient({ product }) {
  const { addItem } = useCart();
  const { user } = useAuth();
  const [activeImage, setActiveImage] = useState(0);
  const [size, setSize] = useState(product.sizes?.[0] || "");
  const [color, setColor] = useState(product.colors?.[0] || "");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const [reviews, setReviews] = useState(product.reviews || []);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [reviewError, setReviewError] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const hasDiscount = product.compareAtPrice > product.price;

  function handleAddToCart() {
    addItem(product, { quantity, size, color });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  async function submitReview(e) {
    e.preventDefault();
    setReviewError("");
    setSubmittingReview(true);
    try {
      const res = await fetch(`/api/products/${product._id}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not submit review");
      setReviews(data.reviews);
      setReviewForm({ rating: 5, comment: "" });
    } catch (err) {
      setReviewError(err.message);
    } finally {
      setSubmittingReview(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid gap-10 md:grid-cols-2">
        {/* Gallery */}
        <div>
          <div className="relative aspect-square overflow-hidden rounded-sm bg-ink/5">
            {product.images?.[activeImage] && (
              <Image src={product.images[activeImage]} alt={product.name} fill className="object-cover" priority />
            )}
          </div>
          {product.images?.length > 1 && (
            <div className="mt-3 flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={img}
                  onClick={() => setActiveImage(i)}
                  className={`relative h-16 w-16 overflow-hidden rounded-sm border ${
                    i === activeImage ? "border-teal" : "border-ink/10"
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-teal">{product.category}</p>
          <h1 className="mt-1 font-display text-3xl font-bold">{product.name}</h1>

          {product.numReviews > 0 && (
            <div className="mt-2">
              <StarRating rating={product.rating} count={product.numReviews} />
            </div>
          )}

          <div className="mt-4 flex items-baseline gap-3">
            <span className="price-tag text-2xl">Rs. {product.price.toLocaleString()}</span>
            {hasDiscount && (
              <span className="font-mono text-base text-ink/40 line-through">
                Rs. {product.compareAtPrice.toLocaleString()}
              </span>
            )}
          </div>

          <p className="mt-4 text-sm leading-relaxed text-ink/80">{product.description}</p>

          {product.sizes?.length > 0 && (
            <div className="mt-5">
              <p className="mb-1.5 text-sm font-semibold">Size</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`rounded-sm border px-3 py-1.5 text-sm ${
                      size === s ? "border-teal bg-teal text-canvas" : "border-ink/20"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.colors?.length > 0 && (
            <div className="mt-4">
              <p className="mb-1.5 text-sm font-semibold">Color</p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`rounded-sm border px-3 py-1.5 text-sm ${
                      color === c ? "border-teal bg-teal text-canvas" : "border-ink/20"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-5 flex items-center gap-3">
            <p className="text-sm font-semibold">Quantity</p>
            <div className="flex items-center rounded-sm border border-ink/20">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="px-3 py-1.5">−</button>
              <span className="px-3 text-sm">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                className="px-3 py-1.5"
              >
                +
              </button>
            </div>
            <span className="text-xs text-ink/50">{product.stock} in stock</span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock < 1}
            className="btn-primary mt-6 w-full disabled:cursor-not-allowed disabled:opacity-40"
          >
            {product.stock < 1 ? "Out of Stock" : added ? "Added ✓" : "Add to Cart"}
          </button>
        </div>
      </div>

      {/* Reviews */}
      <section className="mt-16 max-w-2xl">
        <h2 className="mb-4 text-xl font-bold">Customer Reviews ({reviews.length})</h2>

        <div className="space-y-4">
          {reviews.length === 0 && <p className="text-sm text-ink/50">No reviews yet. Be the first to review this product.</p>}
          {reviews.map((r, i) => (
            <div key={i} className="border-b border-ink/10 pb-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">{r.name}</span>
                <StarRating rating={r.rating} size="sm" />
              </div>
              <p className="mt-1 text-sm text-ink/70">{r.comment}</p>
            </div>
          ))}
        </div>

        {user ? (
          <form onSubmit={submitReview} className="mt-6 space-y-3">
            <div>
              <label className="mb-1 block text-sm font-semibold">Your Rating</label>
              <select
                value={reviewForm.rating}
                onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                className="input-field !w-auto"
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>{n} star{n > 1 ? "s" : ""}</option>
                ))}
              </select>
            </div>
            <textarea
              required
              placeholder="Share your experience with this product..."
              value={reviewForm.comment}
              onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
              className="input-field"
              rows={3}
            />
            {reviewError && <p className="text-sm text-brick">{reviewError}</p>}
            <button type="submit" disabled={submittingReview} className="btn-secondary">
              {submittingReview ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        ) : (
          <p className="mt-4 text-sm text-ink/60">
            <a href="/login" className="text-teal underline">Log in</a> to leave a review.
          </p>
        )}
      </section>
    </div>
  );
}
