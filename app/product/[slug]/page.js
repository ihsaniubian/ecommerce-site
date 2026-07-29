import { notFound } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import ProductDetailClient from "@/components/ProductDetailClient";

export default async function ProductPage({ params }) {
  const { slug } = await params;
  await connectDB();

  const product = await Product.findOne({ slug, isActive: true }).lean();
  if (!product) notFound();

  return <ProductDetailClient product={JSON.parse(JSON.stringify(product))} />;
}
