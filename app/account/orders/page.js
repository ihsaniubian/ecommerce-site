"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const STATUS_COLORS = {
  pending: "bg-saffron/20 text-saffron-dark",
  confirmed: "bg-teal/10 text-teal",
  shipped: "bg-teal/10 text-teal",
  delivered: "bg-teal text-canvas",
  cancelled: "bg-brick/10 text-brick",
};

function OrdersContent() {
  const { user, loading } = useAuth();
  const searchParams = useSearchParams();
  const [orders, setOrders] = useState([]);
  const [fetching, setFetching] = useState(true);
  const justPlaced = searchParams.get("placed");

  useEffect(() => {
    if (!user) return;
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => setOrders(data.orders || []))
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
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">My Orders</h1>

      {justPlaced && (
        <div className="mb-6 rounded-sm border border-teal bg-teal/5 p-4 text-sm text-teal-dark">
          Order placed successfully! You'll be notified as it's processed.
        </div>
      )}

      {fetching ? (
        <p className="text-ink/50">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-ink/50">You haven't placed any orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="rounded-sm border border-ink/10 bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold">Order #{order._id.slice(-8).toUpperCase()}</p>
                  <p className="text-xs text-ink/50">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`rounded-sm px-3 py-1 text-xs font-semibold capitalize ${STATUS_COLORS[order.status]}`}>
                  {order.status}
                </span>
              </div>
              <div className="mt-3 space-y-1 text-sm text-ink/70">
                {order.items.map((item, i) => (
                  <p key={i}>{item.name} × {item.quantity}</p>
                ))}
              </div>
              <p className="mt-3 price-tag">Rs. {order.grandTotal.toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<div className="py-16 text-center text-ink/50">Loading...</div>}>
      <OrdersContent />
    </Suspense>
  );
}