import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import User from "@/models/User";
import { getUserFromRequest } from "@/lib/auth";

export async function POST(request, { params }) {
  const decoded = await getUserFromRequest(request);
  if (!decoded) {
    return NextResponse.json({ error: "Please log in to leave a review" }, { status: 401 });
  }

  const { rating, comment } = await request.json();
  if (!rating || !comment) {
    return NextResponse.json({ error: "Rating and comment are required" }, { status: 400 });
  }

  await connectDB();

  const product = await Product.findById(params.id);
  if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

  const alreadyReviewed = product.reviews.find((r) => r.user.toString() === decoded.id);
  if (alreadyReviewed) {
    return NextResponse.json({ error: "You already reviewed this product" }, { status: 409 });
  }

  const user = await User.findById(decoded.id);

  product.reviews.push({ user: user._id, name: user.name, rating, comment });
  product.numReviews = product.reviews.length;
  product.rating = product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length;

  await product.save();

  return NextResponse.json({ success: true, reviews: product.reviews, rating: product.rating });
}
