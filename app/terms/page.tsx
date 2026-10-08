export default function TermsPage() {
  return (
    <main className="min-h-screen bg-black px-page py-hero">
      <div className="mx-auto max-w-2xl">
        <p className="font-mono text-[12px] uppercase tracking-[0.15em] text-gold">Legal</p>
        <h1 className="mt-sm font-display text-[44px] tracking-[0.10em] text-white">
          Terms and Conditions
        </h1>
        <div className="mt-lg space-y-md font-body text-[14px] font-light leading-relaxed text-muted">
          <p>Bookings are for a private hall session of 2 hours 20 minutes, for 1 to 6 guests.</p>
          <p>Doors open at your ticketed time. There are no extensions for late arrivals.</p>
          <p>Bookings cannot be cancelled and are not refundable.</p>
          <p>
            Bookings can be rescheduled up to twice, for a fee of ₦15,000
            per reschedule, to a new date within 14 days of the original
            booking.
          </p>
          <p className="text-white/60">
            This page is a placeholder pending full legal review. Do not
            treat this as final or legally binding until confirmed.
          </p>
        </div>
      </div>
    </main>
  );
}
