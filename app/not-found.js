import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <p className="font-mono text-sm text-ink/40">404</p>
      <h1 className="mt-2 font-display text-3xl font-bold">Page not found</h1>
      <p className="mt-2 text-ink/60">The page you're looking for doesn't exist or was moved.</p>
      <Link href="/" className="btn-primary mt-6 inline-flex">Back to Shop</Link>
    </div>
  );
}
