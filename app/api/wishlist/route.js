import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { getUserFromRequest } from "@/lib/auth";

// GET /api/wishlist — returns the logged-in user's wishlisted products
export async function GET(request) {
  const decoded = await getUserFromRequest(request);
  if (!decoded) return NextResponse.json({ error: "Please log in" }, { status: 401 });

  await connectDB();
  const user = await User.findById(decoded.id).populate("wishlist").lean();
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  return NextResponse.json({ products: user.wishlist });
}

// POST /api/wishlist { productId } — toggles a product in the logged-in user's wishlist
export async function POST(request) {
  const decoded = await getUserFromRequest(request);
  if (!decoded) return NextResponse.json({ error: "Please log in" }, { status: 401 });

  const { productId } = await request.json();
  if (!productId) return NextResponse.json({ error: "productId is required" }, { status: 400 });

  await connectDB();
  const user = await User.findById(decoded.id);

  const index = user.wishlist.findIndex((id) => id.toString() === productId);
  let added;
  if (index >= 0) {
    user.wishlist.splice(index, 1);
    added = false;
  } else {
    user.wishlist.push(productId);
    added = true;
  }
  await user.save();

  return NextResponse.json({ added, wishlist: user.wishlist });
}
