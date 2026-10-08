"use client";

import { useRouter } from "next/navigation";
import { useBooking } from "@/lib/bookingContext";
import { Button } from "@/components/ui/button";
import { MIN_GUESTS, MAX_GUESTS } from "@/lib/policy";

export default function ContactStepPage() {
  const router = useRouter();
  const { draft, update } = useBooking();

  const maxGuests = draft.hallCapacity ?? MAX_GUESTS;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push("/book/checkout");
  }

  return (
    <div>
      <p className="font-mono text-[13px] font-medium uppercase tracking-[0.15em] text-gold">Step 4</p>
      <h1 className="mt-sm font-display text-[38px] tracking-[0.10em] text-white">
        Your Details
      </h1>
      <p className="mt-sm font-body text-[15px] font-light text-muted">
        We'll send your confirmation here.
      </p>

      <form onSubmit={handleSubmit} className="mt-xl max-w-lg space-y-xl">
        <div>
          <label className="mb-md block font-mono text-[13px] font-medium uppercase tracking-[0.15em] text-muted">
            Guests ({MIN_GUESTS} to {maxGuests})
          </label>
          <input
            type="number"
            min={MIN_GUESTS}
            max={maxGuests}
            value={draft.guestCount}
            onChange={(e) => update({ guestCount: Number(e.target.value) })}
            className="w-full max-w-xs rounded border-2 border-border bg-black/20 px-lg py-md font-body text-[16px] text-white outline-none focus:border-gold"
            required
          />
        </div>

        <div>
          <label className="mb-md block font-mono text-[13px] font-medium uppercase tracking-[0.15em] text-muted">
            Full Name
          </label>
          <input
            type="text"
            value={draft.customerName}
            onChange={(e) => update({ customerName: e.target.value })}
            className="w-full rounded border-2 border-border bg-black/20 px-lg py-md font-body text-[16px] text-white outline-none focus:border-gold"
            required
          />
        </div>

        <div>
          <label className="mb-md block font-mono text-[13px] font-medium uppercase tracking-[0.15em] text-muted">
            Email
          </label>
          <input
            type="email"
            value={draft.customerEmail}
            onChange={(e) => update({ customerEmail: e.target.value })}
            className="w-full rounded border-2 border-border bg-black/20 px-lg py-md font-body text-[16px] text-white outline-none focus:border-gold"
            required
          />
        </div>

        <div>
          <label className="mb-md block font-mono text-[13px] font-medium uppercase tracking-[0.15em] text-muted">
            Phone
          </label>
          <input
            type="tel"
            value={draft.customerPhone}
            onChange={(e) => update({ customerPhone: e.target.value })}
            className="w-full rounded border-2 border-border bg-black/20 px-lg py-md font-body text-[16px] text-white outline-none focus:border-gold"
            required
          />
        </div>

        <Button type="submit" size="lg">
          Continue to review
        </Button>
      </form>
    </div>
  );
}
