import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(request, { params }) {
  const decoded = await getUserFromRequest(request);
  if (!decoded) return NextResponse.json({ error: "Please log in" }, { status: 401 });

  await connectDB();
  const order = await Order.findById(params.id).lean();
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  if (order.user.toString() !== decoded.id && decoded.role !== "admin") {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  return NextResponse.json({ order });
}

// PUT — admin updates order status
export async function PUT(request, { params }) {
  const decoded = await getUserFromRequest(request);
  if (!decoded || decoded.role !== "admin") {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const { status, isPaid } = await request.json();
  await connectDB();

  const update = {};
  if (status) update.status = status;
  if (typeof isPaid === "boolean") {
    update.isPaid = isPaid;
    if (isPaid) update.paidAt = new Date();
  }

  const order = await Order.findByIdAndUpdate(params.id, update, { new: true });
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  return NextResponse.json({ order });
}
