export default function RefundPolicyPage() {
  return (
    <main className="min-h-screen bg-black px-page py-hero">
      <div className="mx-auto max-w-2xl">
        <p className="font-mono text-[12px] uppercase tracking-[0.15em] text-gold">Legal</p>
        <h1 className="mt-sm font-display text-[44px] tracking-[0.10em] text-white">
          Refund Policy
        </h1>
        <div className="mt-lg space-y-md font-body text-[14px] font-light leading-relaxed text-muted">
          <p>All bookings are final. We don't offer cancellations or refunds.</p>
          <p>
            If your plans change, you can reschedule instead. Rescheduling
            costs ₦15,000, moves your session to a new date within 14 days
            of the original, and is available up to twice per booking. Head
            to the Manage Booking page with your reference and email to
            start a reschedule.
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
