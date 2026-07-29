"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

const CATEGORIES = ["Men", "Women", "Kids", "Home", "Electronics", "Beauty"];

export default function Navbar() {
  const { itemCount } = useCart();
  const { user, logout } = useAuth();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  function handleSearch(e) {
    e.preventDefault();
    if (search.trim()) router.push(`/?search=${encodeURIComponent(search.trim())}`);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-canvas">
      {/* Deals ticker — signature bazaar-announcement strip */}
      <div className="overflow-hidden bg-teal py-1.5 text-xs font-semibold tracking-wide text-canvas">
        <p className="animate-none px-4 text-center">
          Free delivery on orders over Rs. 5,000 · Cash on delivery available nationwide
        </p>
      </div>

      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3 md:gap-6">
        <Link href="/" className="font-display text-2xl font-bold text-teal shrink-0">
          Bazaar
        </Link>

        <form onSubmit={handleSearch} className="order-3 w-full md:order-none md:w-auto md:flex-1">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for products..."
            className="input-field"
            aria-label="Search products"
          />
        </form>

        <nav className="ml-auto flex items-center gap-4 text-sm font-medium">
          <Link href="/cart" className="relative">
            Cart
            {itemCount > 0 && (
              <span className="absolute -right-3 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-saffron text-[10px] font-bold text-ink">
                {itemCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="relative">
              <button onClick={() => setMenuOpen((o) => !o)} className="font-medium">
                {user.name.split(" ")[0]} ▾
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-44 rounded-sm border border-ink/10 bg-canvas py-1 shadow-lg">
                  <Link href="/account/orders" className="block px-4 py-2 text-sm hover:bg-teal/5" onClick={() => setMenuOpen(false)}>
                    My Orders
                  </Link>
                  <Link href="/account/wishlist" className="block px-4 py-2 text-sm hover:bg-teal/5" onClick={() => setMenuOpen(false)}>
                    Wishlist
                  </Link>
                  {user.role === "admin" && (
                    <Link href="/admin/dashboard" className="block px-4 py-2 text-sm hover:bg-teal/5" onClick={() => setMenuOpen(false)}>
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                    }}
                    className="block w-full px-4 py-2 text-left text-sm hover:bg-teal/5"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="btn-secondary !px-4 !py-1.5">
              Login
            </Link>
          )}
        </nav>
      </div>

      <div className="hidden border-t border-ink/5 md:block">
        <div className="mx-auto flex max-w-7xl gap-6 px-4 py-2 text-sm">
          {CATEGORIES.map((cat) => (
            <Link key={cat} href={`/?category=${encodeURIComponent(cat)}`} className="text-ink/70 hover:text-teal">
              {cat}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
