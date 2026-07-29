import { notFound } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import EditProductClient from "@/components/admin/EditProductClient";

export default async function EditProductPage({ params }) {
  const { id } = await params;
  await connectDB();

  const product = await Product.findById(id).lean();
  if (!product) notFound();

  return <EditProductClient product={JSON.parse(JSON.stringify(product))} />;
}
