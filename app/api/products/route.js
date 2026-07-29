import { NextResponse } from "next/server";
import slugify from "slugify";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { getUserFromRequest } from "@/lib/auth";

// GET /api/products?search=&category=&minPrice=&maxPrice=&sort=&page=&limit=
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search");
    const category = searchParams.get("category");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sort = searchParams.get("sort") || "newest";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "12", 10);

    const query = { isActive: true };
    if (search) query.$text = { $search: search };
    if (category) query.category = category;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const sortMap = {
      newest: { createdAt: -1 },
      priceAsc: { price: 1 },
      priceDesc: { price: -1 },
      rating: { rating: -1 },
    };

    const [products, total] = await Promise.all([
      Product.find(query)
        .sort(sortMap[sort] || sortMap.newest)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Product.countDocuments(query),
    ]);

    return NextResponse.json({ products, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error("Product list error:", err);
    return NextResponse.json({ error: "Failed to load products" }, { status: 500 });
  }
}

// POST /api/products — admin only, creates a new product
export async function POST(request) {
  try {
    const decoded = await getUserFromRequest(request);
    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const body = await request.json();
    const { name, description, price, compareAtPrice, images, category, brand, sizes, colors, stock, sku, isFeatured } = body;

    if (!name || !description || !price || !images?.length || !category) {
      return NextResponse.json({ error: "Missing required product fields" }, { status: 400 });
    }

    await connectDB();

    const baseSlug = slugify(name, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;
    while (await Product.findOne({ slug })) {
      slug = `${baseSlug}-${counter++}`;
    }

    const product = await Product.create({
      name,
      slug,
      description,
      price,
      compareAtPrice,
      images,
      category,
      brand,
      sizes: sizes || [],
      colors: colors || [],
      stock: stock || 0,
      sku,
      isFeatured: !!isFeatured,
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (err) {
    console.error("Product create error:", err);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
