"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function CheckoutPage() {
  const { items, itemsTotal, clearCart } = useCart();
  const { user, loading } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    fullName: user?.name || "",
    phone: "",
    line1: "",
    city: "",
    postalCode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const shippingFee = itemsTotal >= 5000 || itemsTotal === 0 ? 0 : 200;
  const grandTotal = itemsTotal + shippingFee;

  if (!loading && !user) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Please log in to checkout</h1>
        <a href="/login?redirect=/checkout" className="btn-primary mt-6 inline-flex">Log In</a>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <a href="/" className="btn-primary mt-6 inline-flex">Continue Shopping</a>
      </div>
    );
  }

  async function placeOrder(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            size: i.size,
            color: i.color,
          })),
          shippingAddress: form,
          paymentMethod,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not place order");
      clearCart();
      router.push(`/account/orders?placed=${data.order._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Checkout</h1>
      <div className="grid gap-8 md:grid-cols-3">
        <form onSubmit={placeOrder} className="space-y-4 md:col-span-2">
          <h2 className="font-semibold">Delivery Address</h2>
          <input
            required
            placeholder="Full Name"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            className="input-field"
          />
          <input
            required
            placeholder="Phone Number"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="input-field"
          />
          <input
            required
            placeholder="Address (House #, Street, Area)"
            value={form.line1}
            onChange={(e) => setForm({ ...form, line1: e.target.value })}
            className="input-field"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              required
              placeholder="City"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="input-field"
            />
            <input
              placeholder="Postal Code"
              value={form.postalCode}
              onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
              className="input-field"
            />
          </div>

          <h2 className="pt-2 font-semibold">Payment Method</h2>
          <div className="space-y-2">
            <label className="flex items-center gap-2 rounded-sm border border-ink/20 p-3">
              <input
                type="radio"
                checked={paymentMethod === "cod"}
                onChange={() => setPaymentMethod("cod")}
              />
              Cash on Delivery
            </label>
            <label className="flex items-center gap-2 rounded-sm border border-ink/20 p-3">
              <input
                type="radio"
                checked={paymentMethod === "card"}
                onChange={() => setPaymentMethod("card")}
              />
              Credit/Debit Card (pay on delivery confirmation call)
            </label>
          </div>

          {error && <p className="text-sm text-brick">{error}</p>}

          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? "Placing Order..." : `Place Order — Rs. ${grandTotal.toLocaleString()}`}
          </button>
        </form>

        <div className="h-fit rounded-sm border border-ink/10 bg-white p-5">
          <h2 className="mb-4 font-semibold">Order Summary</h2>
          <div className="space-y-2 text-sm">
            {items.map((i) => (
              <div key={`${i.productId}-${i.size}-${i.color}`} className="flex justify-between">
                <span className="text-ink/70">{i.name} × {i.quantity}</span>
                <span>Rs. {(i.price * i.quantity).toLocaleString()}</span>
              </div>
            ))}
            <div className="flex justify-between border-t border-ink/10 pt-2">
              <span className="text-ink/60">Shipping</span>
              <span>{shippingFee === 0 ? "Free" : `Rs. ${shippingFee}`}</span>
            </div>
            <div className="flex justify-between border-t border-ink/10 pt-2 font-semibold">
              <span>Total</span>
              <span>Rs. {grandTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
