"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { items, updateQuantity, removeItem, itemsTotal } = useCart();
  const shippingFee = itemsTotal >= 5000 || itemsTotal === 0 ? 0 : 200;
  const grandTotal = itemsTotal + shippingFee;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-ink/60">Browse our products and add something you like.</p>
        <Link href="/" className="btn-primary mt-6 inline-flex">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Your Cart</h1>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="space-y-4 md:col-span-2">
          {items.map((item) => (
            <div key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-4 border-b border-ink/10 pb-4">
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-sm bg-ink/5">
                {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" />}
              </div>
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Link href={`/product/${item.slug}`} className="font-medium hover:text-teal">{item.name}</Link>
                    <p className="text-xs text-ink/50">
                      {item.size && `Size: ${item.size}`} {item.color && `· Color: ${item.color}`}
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId, item.size, item.color)}
                    className="text-sm text-brick"
                  >
                    Remove
                  </button>
                </div>

                <div className="mt-auto flex items-center justify-between pt-2">
                  <div className="flex items-center rounded-sm border border-ink/20">
                    <button
                      onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)}
                      className="px-3 py-1"
                    >
                      −
                    </button>
                    <span className="px-3 text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)}
                      className="px-3 py-1"
                    >
                      +
                    </button>
                  </div>
                  <span className="price-tag">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="h-fit rounded-sm border border-ink/10 bg-white p-5">
          <h2 className="mb-4 font-semibold">Order Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-ink/60">Subtotal</span>
              <span>Rs. {itemsTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink/60">Shipping</span>
              <span>{shippingFee === 0 ? "Free" : `Rs. ${shippingFee}`}</span>
            </div>
            <div className="flex justify-between border-t border-ink/10 pt-2 font-semibold">
              <span>Total</span>
              <span>Rs. {grandTotal.toLocaleString()}</span>
            </div>
          </div>
          <Link href="/checkout" className="btn-primary mt-5 w-full">Proceed to Checkout</Link>
        </div>
      </div>
    </div>
  );
}
