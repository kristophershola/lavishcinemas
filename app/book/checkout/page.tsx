"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useBooking } from "@/lib/bookingContext";
import { Button } from "@/components/ui/button";
import { SPECIAL_EVENT_UPGRADE_FEE, formatNaira } from "@/lib/policy";

export default function CheckoutPage() {
  const { draft } = useBooking();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const missing = useMemo(() => {
    const items: { label: string; href: string }[] = [];
    if (!draft.hallId || !draft.date || !draft.startTime) {
      items.push({ label: "Hall, Date & Time", href: "/book/datetime" });
    }
    if (!draft.packageId) items.push({ label: "Package", href: "/book/package" });
    if (!draft.customerName || !draft.customerEmail || !draft.customerPhone) {
      items.push({ label: "Your Details", href: "/book/contact" });
    }
    return items;
  }, [draft]);

  const total = (draft.packagePrice ?? 0) + (draft.specialEventUpgrade ? SPECIAL_EVENT_UPGRADE_FEE : 0);
  const canSubmit = missing.length === 0;

  async function handleConfirm() {
    if (!canSubmit) return;
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hallId: draft.hallId,
          packageId: draft.packageId,
          date: draft.date,
          startTime: draft.startTime,
          guestCount: draft.guestCount,
          customerName: draft.customerName,
          customerEmail: draft.customerEmail,
          customerPhone: draft.customerPhone,
          specialEventUpgrade: draft.specialEventUpgrade,
          movieTitle: draft.movieTitle,
          moviePosterUrl: draft.moviePosterUrl,
          movieTmdbId: draft.movieTmdbId
        })
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error ?? "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }

      window.location.href = json.authorizationUrl;
    } catch {
      setError("Network error. Please check your connection and try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <p className="font-mono text-[13px] font-medium uppercase tracking-[0.15em] text-gold">Step 5</p>
      <h1 className="mt-sm font-display text-[38px] tracking-[0.10em] text-white">
        Check Everything, Then Pay
      </h1>

      {missing.length > 0 && (
        <div className="mt-lg rounded border-2 border-gold bg-gold-dim p-lg">
          <p className="font-mono text-[12px] font-medium uppercase tracking-[0.10em] text-gold">
            Still needed
          </p>
          <div className="mt-sm flex flex-wrap gap-sm">
            {missing.map((item) => (
              <Button key={item.href} asChild variant="outline" size="sm">
                <Link href={item.href}>{item.label} →</Link>
              </Button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-xl space-y-md rounded border-2 border-border bg-black/20 p-xl">
        <SummaryRow label="Hall" value={draft.hallName ?? "Not selected"} href="/book/datetime" />
        <SummaryRow
          label="Date & Time"
          value={
            draft.date && draft.startTime
              ? `${new Date(draft.date).toLocaleDateString("en-NG", {
                  weekday: "long",
                  month: "long",
                  day: "numeric"
                })}, ${draft.startTime} to ${draft.endTime}`
              : "Not selected"
          }
          href="/book/datetime"
        />
        <SummaryRow
          label="Film"
          value={draft.movieTitle ?? (draft.movieSkipped ? "Chosen on arrival" : "Not selected")}
          href="/book/movie"
        />
        <SummaryRow
          label="Package"
          value={draft.packageName ? `${draft.packageName} (${formatNaira(draft.packagePrice ?? 0)})` : "Not selected"}
          href="/book/package"
        />
        {draft.specialEventUpgrade && (
          <SummaryRow label="Special Event Upgrade" value={formatNaira(SPECIAL_EVENT_UPGRADE_FEE)} href="/book/package" />
        )}
        <SummaryRow label="Guests" value={String(draft.guestCount)} href="/book/contact" />
        <SummaryRow label="Name" value={draft.customerName || "Not provided"} href="/book/contact" />
        <SummaryRow label="Email" value={draft.customerEmail || "Not provided"} href="/book/contact" />
        <SummaryRow label="Phone" value={draft.customerPhone || "Not provided"} href="/book/contact" />
      </div>

      <div className="mt-lg rounded border-2 border-border bg-black/20 p-lg">
        <p className="font-mono text-[12px] uppercase tracking-[0.10em] text-muted">
          No cancellations. No refunds. Doors open at your ticketed time, no
          extensions for late arrivals.
        </p>
      </div>

      {error && <p className="mt-md font-body text-[14px] font-medium text-red-400">{error}</p>}

      <div className="mt-2xl flex items-center justify-between border-t-2 border-border pt-lg">
        <div>
          <p className="font-mono text-[12px] uppercase tracking-[0.10em] text-muted">Total</p>
          <p className="font-display text-[36px] text-gold">{formatNaira(total)}</p>
        </div>
        <Button onClick={handleConfirm} disabled={!canSubmit || submitting} size="lg">
          {submitting ? "Redirecting..." : "Proceed to payment"}
        </Button>
      </div>
    </div>
  );
}

function SummaryRow({ label, value, href }: { label: string; value: string; href: string }) {
  return (
    <div className="flex items-center justify-between gap-md">
      <span className="font-mono text-[12px] uppercase tracking-[0.10em] text-muted">{label}</span>
      <div className="flex items-center gap-md">
        <span className="font-body text-[15px] font-medium text-white">{value}</span>
        <Link
          href={href}
          className="font-mono text-[12px] font-medium uppercase tracking-[0.10em] text-gold underline underline-offset-4"
        >
          Edit
        </Link>
      </div>
    </div>
  );
}
