"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useBooking } from "@/lib/bookingContext";

const STEPS = [
  { href: "/book/datetime", label: "Date & Time", optional: false },
  { href: "/book/movie", label: "Movie", optional: true },
  { href: "/book/package", label: "Package", optional: false },
  { href: "/book/contact", label: "Details", optional: false },
  { href: "/book/checkout", label: "Review & Pay", optional: false }
];

export default function BookingStepNav() {
  const pathname = usePathname();
  const { draft, hydrated } = useBooking();

  function isComplete(href: string): boolean {
    if (!hydrated) return false;
    switch (href) {
      case "/book/datetime":
        return Boolean(draft.hallId && draft.date && draft.startTime);
      case "/book/movie":
        return Boolean(draft.movieTitle) || draft.movieSkipped;
      case "/book/package":
        return Boolean(draft.packageId);
      case "/book/contact":
        return Boolean(draft.customerName && draft.customerEmail && draft.customerPhone);
      default:
        return false;
    }
  }

  return (
    <nav className="border-b-2 border-border bg-black/90 backdrop-blur-md sticky top-[76px] z-40">
      <div className="flex items-center gap-md overflow-x-auto px-page py-lg">
        {STEPS.map((step, i) => {
          const active = pathname === step.href;
          const done = isComplete(step.href);
          return (
            <Link
              key={step.href}
              href={step.href}
              className={`flex shrink-0 items-center gap-sm rounded-pill border-2 px-lg py-md font-mono text-[12px] font-medium uppercase tracking-[0.12em] transition ${
                active
                  ? "border-gold bg-gold text-black"
                  : done
                  ? "border-gold/50 text-gold hover:border-gold"
                  : "border-border text-muted hover:border-gold/40 hover:text-white"
              }`}
            >
              <span>{i + 1}. {step.label}</span>
              {step.optional && !done && <span className="text-muted/60">(optional)</span>}
              {done && !active && <span className="text-gold">✓</span>}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
