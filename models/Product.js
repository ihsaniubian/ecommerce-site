import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    compareAtPrice: { type: Number }, // original price, for showing discounts
    images: [{ type: String, required: true }], // Cloudinary URLs
    category: { type: String, required: true, index: true },
    brand: { type: String, default: "" },
    sizes: [{ type: String }], // e.g. ["S","M","L"] — empty if not applicable
    colors: [{ type: String }], // e.g. ["Red","Black"] — empty if not applicable
    stock: { type: Number, required: true, default: 0 },
    sku: { type: String, unique: true, sparse: true },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    reviews: [ReviewSchema],
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ProductSchema.index({ name: "text", description: "text", category: "text", brand: "text" });

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
