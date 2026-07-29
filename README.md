# Bazaar — Full Custom E-commerce Site

Next.js 15 (App Router) + MongoDB + Cloudinary. Built to match your feature list: homepage, product pages with reviews, cart, checkout, accounts (orders/wishlist), and an admin panel.

## 1. Install dependencies

```bash
npm install
```

## 2. Set up environment variables

Copy `.env.local.example` to `.env.local` and fill in:

- `MONGODB_URI` — from MongoDB Atlas (create a free cluster if you don't have one)
- `JWT_SECRET` — any long random string (e.g. generate with `openssl rand -hex 32`)
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` — from your Cloudinary dashboard
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` — same as `CLOUDINARY_CLOUD_NAME`
- `ADMIN_EMAIL`, `ADMIN_PASSWORD` — credentials for your first admin account

## 3. Create your admin account

```bash
node scripts/create-admin.js
```

This creates (or promotes) a user with the email/password from `.env.local` to `role: admin`. Log in with those credentials to access `/admin/dashboard`.

## 4. Run locally

```bash
npm run dev
```

Visit `http://localhost:3000`.

## 5. Add your first products

Log in as admin → go to `/admin/products/add` → upload images (they go straight to Cloudinary) → fill details → Add Product. Check "Show in Featured Picks" to feature it on the homepage.

## 6. Deploy to Vercel

1. Push this project to a GitHub repo.
2. Import it in Vercel.
3. Add the same environment variables from `.env.local` in Vercel's project settings.
4. Deploy. Run `node scripts/create-admin.js` locally (pointed at the same `MONGODB_URI`) to create your admin account for production too.

## What's included

- **Storefront:** homepage with search/category/sort, product detail pages (variants, gallery, reviews), cart, checkout (COD or card), order history, wishlist
- **Accounts:** register/login (JWT in httpOnly cookie), protected checkout/account pages
- **Admin panel:** dashboard (sales, low-stock alerts), add products (with Cloudinary image upload), manage order statuses
- **Backend:** MongoDB via Mongoose, REST API routes under `/app/api`, admin routes protected by middleware

## What to do next (not yet built)

- Real payment gateway integration (currently COD + "card, confirmed on delivery call" — wire up Stripe or a local gateway like JazzCash/Easypaisa when you're ready)
- Product edit/delete UI in the admin panel (API routes for it already exist — `PUT`/`DELETE` on `/api/products/[id]`)
- Order confirmation emails/SMS
- SEO metadata per product page (dynamic `generateMetadata`)
- Image gallery zoom, related products section
