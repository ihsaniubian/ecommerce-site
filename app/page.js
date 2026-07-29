import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import ProductCard from "@/components/ProductCard";
import SortSelect from "@/components/SortSelect";

const CATEGORIES = ["Men", "Women", "Kids", "Home", "Electronics", "Beauty"];

export default async function HomePage({ searchParams }) {
  const { search, category, sort } = await searchParams;
  await connectDB();

  const query = { isActive: true };
  if (search) query.$text = { $search: search };
  if (category) query.category = category;

  const sortMap = {
    priceAsc: { price: 1 },
    priceDesc: { price: -1 },
    rating: { rating: -1 },
  };

  const isFiltering = Boolean(search || category);

  const [products, featured] = await Promise.all([
    Product.find(query).sort(sortMap[sort] || { createdAt: -1 }).limit(24).lean(),
    isFiltering ? [] : Product.find({ isActive: true, isFeatured: true }).limit(8).lean(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      {!isFiltering && (
        <section className="mb-10 overflow-hidden rounded-sm bg-teal px-8 py-14 text-canvas md:px-16">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-saffron-light">
            New season, honest prices
          </p>
          <h1 className="max-w-xl font-display text-4xl font-bold leading-tight md:text-5xl">
            Everything you need, delivered to your door.
          </h1>
          <p className="mt-3 max-w-md text-canvas/80">
            Shop thousands of products across fashion, home, and electronics — with cash on delivery available nationwide.
          </p>
        </section>
      )}

      <div className="mb-8 flex flex-wrap gap-3">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat}
            href={`/?category=${encodeURIComponent(cat)}`}
            className={`rounded-sm border px-4 py-1.5 text-sm font-medium ${
              category === cat ? "border-teal bg-teal text-canvas" : "border-ink/15 text-ink/70 hover:border-teal"
            }`}
          >
            {cat}
          </Link>
        ))}
      </div>

      {!isFiltering && featured.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-bold">Featured Picks</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p._id.toString()} product={JSON.parse(JSON.stringify(p))} />
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {isFiltering ? `Results${category ? ` in ${category}` : ""}` : "All Products"}
          </h2>
          <form>
            {category && <input type="hidden" name="category" value={category} />}
            {search && <input type="hidden" name="search" value={search} />}
            <SortSelect defaultValue={sort} />
          </form>
        </div>

        {products.length === 0 ? (
          <p className="py-12 text-center text-ink/50">No products found. Try a different search or category.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p._id.toString()} product={JSON.parse(JSON.stringify(p))} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}