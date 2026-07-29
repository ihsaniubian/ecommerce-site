import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(request) {
  const decoded = await getUserFromRequest(request);
  if (!decoded) return NextResponse.json({ user: null });

  await connectDB();
  const user = await User.findById(decoded.id).select("-password");
  if (!user) return NextResponse.json({ user: null });

  return NextResponse.json({
    user: { id: user._id, name: user.name, email: user.email, role: user.role, wishlist: user.wishlist },
  });
}
