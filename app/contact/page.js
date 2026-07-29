export default function ContactPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <h1 className="mb-4 font-display text-3xl font-bold">Contact Us</h1>
      <p className="text-ink/70">We're here to help with orders, returns, or any questions.</p>
      <div className="mt-6 space-y-2 text-sm">
        <p>Email: support@example.com</p>
        <p>Phone: +92 300 0000000</p>
        <p>Hours: Mon–Sat, 10 AM – 8 PM</p>
        <a href="https://wa.me/923000000000" target="_blank" rel="noreferrer" className="btn-primary mt-4 inline-flex">
          Chat on WhatsApp
        </a>
      </div>
    </div>
  );
}
