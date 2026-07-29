"use client";

import { useEffect, useState } from "react";

const STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  function loadOrders() {
    setLoading(true);
    fetch("/api/orders?all=true")
      .then((res) => res.json())
      .then((data) => setOrders(data.orders || []))
      .finally(() => setLoading(false));
  }

  async function updateStatus(orderId, status) {
    setUpdating(orderId);
    await fetch(`/api/orders/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, status } : o)));
    setUpdating(null);
  }

  if (loading) return <p className="text-ink/50">Loading orders...</p>;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Orders</h1>
      {orders.length === 0 ? (
        <p className="text-ink/50">No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="rounded-sm border border-ink/10 bg-white p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">Order #{order._id.slice(-8).toUpperCase()}</p>
                  <p className="text-xs text-ink/50">{new Date(order.createdAt).toLocaleString()}</p>
                  <p className="mt-1 text-xs text-ink/60">
                    {order.shippingAddress.fullName} · {order.shippingAddress.phone} · {order.shippingAddress.city}
                  </p>
                </div>
                <select
                  value={order.status}
                  disabled={updating === order._id}
                  onChange={(e) => updateStatus(order._id, e.target.value)}
                  className="input-field !w-auto text-sm capitalize"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s} className="capitalize">{s}</option>
                  ))}
                </select>
              </div>
              <div className="mt-3 space-y-1 border-t border-ink/5 pt-3 text-sm text-ink/70">
                {order.items.map((item, i) => (
                  <p key={i}>{item.name} × {item.quantity} {item.size && `(${item.size})`}</p>
                ))}
              </div>
              <div className="mt-3 flex justify-between text-sm">
                <span className="text-ink/50 capitalize">{order.paymentMethod === "cod" ? "Cash on Delivery" : "Card"}</span>
                <span className="price-tag">Rs. {order.grandTotal.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
