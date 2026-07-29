import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { getUserFromRequest } from "@/lib/auth";

// POST /api/orders — create a new order from the cart
export async function POST(request) {
  const decoded = await getUserFromRequest(request);
  if (!decoded) {
    return NextResponse.json({ error: "Please log in to place an order" }, { status: 401 });
  }

  const { items, shippingAddress, paymentMethod } = await request.json();

  if (!items?.length || !shippingAddress || !paymentMethod) {
    return NextResponse.json({ error: "Missing order details" }, { status: 400 });
  }

  await connectDB();

  // Re-fetch products server-side so prices/stock can't be tampered with client-side
  const productIds = items.map((i) => i.productId);
  const products = await Product.find({ _id: { $in: productIds } });

  const orderItems = [];
  let itemsTotal = 0;

  for (const item of items) {
    const product = products.find((p) => p._id.toString() === item.productId);
    if (!product) continue;
    if (product.stock < item.quantity) {
      return NextResponse.json({ error: `${product.name} is out of stock` }, { status: 409 });
    }
    orderItems.push({
      product: product._id,
      name: product.name,
      image: product.images[0],
      price: product.price,
      size: item.size || "",
      color: item.color || "",
      quantity: item.quantity,
    });
    itemsTotal += product.price * item.quantity;
  }

  if (!orderItems.length) {
    return NextResponse.json({ error: "No valid items in cart" }, { status: 400 });
  }

  const shippingFee = itemsTotal >= 5000 ? 0 : 200; // free shipping over Rs. 5000
  const grandTotal = itemsTotal + shippingFee;

  const order = await Order.create({
    user: decoded.id,
    items: orderItems,
    shippingAddress,
    paymentMethod,
    itemsTotal,
    shippingFee,
    grandTotal,
  });

  // Decrement stock
  for (const item of orderItems) {
    await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
  }

  return NextResponse.json({ order }, { status: 201 });
}

// GET /api/orders — logged-in user's own orders, or all orders if admin (?all=true)
export async function GET(request) {
  const decoded = await getUserFromRequest(request);
  if (!decoded) {
    return NextResponse.json({ error: "Please log in" }, { status: 401 });
  }

  await connectDB();

  const { searchParams } = new URL(request.url);
  const wantsAll = searchParams.get("all") === "true";

  const filter = wantsAll && decoded.role === "admin" ? {} : { user: decoded.id };
  const orders = await Order.find(filter).sort({ createdAt: -1 }).lean();

  return NextResponse.json({ orders });
}
