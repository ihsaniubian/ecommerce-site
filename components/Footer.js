import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-ink/10 bg-teal-dark text-canvas/90">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 text-sm md:grid-cols-4">
        <div>
          <p className="font-display text-xl font-bold text-canvas">Bazaar</p>
          <p className="mt-2 text-canvas/70">Quality products, honest prices, fast delivery across Pakistan.</p>
        </div>
        <div>
          <p className="mb-2 font-semibold text-canvas">Help</p>
          <ul className="space-y-1 text-canvas/70">
            <li><Link href="/contact" className="hover:text-canvas">Contact Us</Link></li>
            <li><Link href="/returns" className="hover:text-canvas">Return &amp; Refund Policy</Link></li>
            <li><Link href="/privacy" className="hover:text-canvas">Privacy Policy</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-2 font-semibold text-canvas">Shop</p>
          <ul className="space-y-1 text-canvas/70">
            <li><Link href="/?category=Men" className="hover:text-canvas">Men</Link></li>
            <li><Link href="/?category=Women" className="hover:text-canvas">Women</Link></li>
            <li><Link href="/?category=Electronics" className="hover:text-canvas">Electronics</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-2 font-semibold text-canvas">Chat with us</p>
          <a
            href="https://wa.me/923000000000"
            target="_blank"
            rel="noreferrer"
            className="inline-block rounded-sm bg-saffron px-4 py-2 font-semibold text-ink"
          >
            WhatsApp Support
          </a>
        </div>
      </div>
      <div className="border-t border-canvas/10 py-4 text-center text-xs text-canvas/60">
        © {new Date().getFullYear()} Bazaar. All rights reserved. Secured with SSL.
      </div>
    </footer>
  );
}
