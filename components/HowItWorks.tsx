import Link from "next/link";
import { Button } from "@/components/ui/button";

const STEPS = [
  {
    number: "01",
    title: "Pick Your Film & Package",
    description: "Browse what's showing or skip it for now, then choose a package for food and drink."
  },
  {
    number: "02",
    title: "Choose Your Hall & Time",
    description: "Pick Hall 1 or Hall 2 and a session time that works for your group."
  },
  {
    number: "03",
    title: "Pay Securely Online",
    description: "Confirm everything and pay through Paystack, no calls, no back and forth."
  },
  {
    number: "04",
    title: "Walk In And Settle Down",
    description: "Arrive at your ticketed time. The hall is yours alone for 2 hours 20 minutes."
  }
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-7xl px-page pb-hero scroll-mt-[160px]">
      <h2 className="font-display text-[56px] tracking-[0.06em] text-white underline decoration-gold decoration-[3px] underline-offset-[12px]">
        How It Works
      </h2>
      <p className="mt-lg max-w-lg font-body text-[14px] font-light text-muted">
        Four steps, start to finish, from picking your night to walking into your own hall.
      </p>

      <div className="mt-xl grid gap-xl sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step) => (
          <div key={step.number} className="rounded border border-border bg-surface p-lg">
            <span className="font-display text-[32px] text-gold/60">{step.number}</span>
            <h3 className="mt-md card-title font-body text-[14px] font-medium uppercase text-white">
              {step.title}
            </h3>
            <p className="mt-sm font-body text-[13px] font-light text-muted">
              {step.description}
            </p>
          </div>
        ))}
      </div>

      <Button asChild size="lg" className="mt-xl mx-auto flex w-fit">
        <Link href="/book">Book a Hall</Link>
      </Button>
    </section>
  );
}
