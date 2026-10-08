export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-black px-page py-hero">
      <div className="mx-auto max-w-2xl">
        <p className="font-mono text-[12px] uppercase tracking-[0.15em] text-gold">Legal</p>
        <h1 className="mt-sm font-display text-[44px] tracking-[0.10em] text-white">
          Privacy Policy
        </h1>
        <div className="mt-lg space-y-md font-body text-[14px] font-light leading-relaxed text-muted">
          <p>
            When you book, we collect your name, email, and phone number to
            confirm and manage your session, and to process payment through
            Paystack.
          </p>
          <p>We don't sell your information to anyone.</p>
          <p className="text-white/60">
            This page is a placeholder pending full legal review. Do not
            treat this as final or legally binding until confirmed.
          </p>
        </div>
      </div>
    </main>
  );
}
