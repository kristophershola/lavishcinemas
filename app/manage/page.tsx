"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  RESCHEDULE_FEE,
  RESCHEDULE_WINDOW_DAYS,
  MAX_RESCHEDULES_PER_BOOKING,
  formatNaira
} from "@/lib/policy";

type Booking = {
  id: string;
  reference: string;
  date: string;
  startTime: string;
  endTime: string;
  guestCount: number;
  amount: number;
  status: string;
  paymentStatus: string;
  customerEmail: string;
  rescheduleCount: number;
  hall: { id: string; name: string };
  package: { name: string };
};

type Slot = { startTime: string; endTime: string; available: boolean };

export default function ManagePage() {
  const [reference, setReference] = useState("");
  const [email, setEmail] = useState("");
  const [booking, setBooking] = useState<Booking | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [lookingUp, setLookingUp] = useState(false);

  const [newDate, setNewDate] = useState("");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [newStartTime, setNewStartTime] = useState("");
  const [rescheduleError, setRescheduleError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    setLookupError(null);
    setLookingUp(true);
    setBooking(null);

    const res = await fetch("/api/manage/lookup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reference, email })
    });
    const json = await res.json();
    setLookingUp(false);

    if (!res.ok) {
      setLookupError(json.error ?? "Could not find that booking.");
      return;
    }

    setBooking(json.booking);
  }

  const minDate = useMemo(() => {
    if (!booking) return "";
    return new Date(booking.date).toISOString().split("T")[0];
  }, [booking]);

  const maxDate = useMemo(() => {
    if (!booking) return "";
    const d = new Date(booking.date);
    d.setDate(d.getDate() + RESCHEDULE_WINDOW_DAYS);
    return d.toISOString().split("T")[0];
  }, [booking]);

  useEffect(() => {
    if (!booking || !newDate) {
      setSlots([]);
      return;
    }
    setLoadingSlots(true);
    setNewStartTime("");
    fetch(`/api/sessions?hallId=${booking.hall.id}&date=${newDate}`)
      .then((res) => res.json())
      .then((json) => setSlots(json.slots ?? []))
      .finally(() => setLoadingSlots(false));
  }, [booking, newDate]);

  async function handleReschedule(e: React.FormEvent) {
    e.preventDefault();
    if (!booking || !newDate || !newStartTime) return;

    setRescheduleError(null);
    setSubmitting(true);

    const res = await fetch("/api/manage/reschedule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bookingId: booking.id,
        email: booking.customerEmail,
        newDate,
        newStartTime
      })
    });
    const json = await res.json();

    if (!res.ok) {
      setRescheduleError(json.error ?? "Could not start the reschedule.");
      setSubmitting(false);
      return;
    }

    window.location.href = json.authorizationUrl;
  }

  const eligible =
    booking &&
    booking.status === "CONFIRMED" &&
    booking.paymentStatus === "PAID" &&
    booking.rescheduleCount < MAX_RESCHEDULES_PER_BOOKING;

  const remaining = booking ? MAX_RESCHEDULES_PER_BOOKING - booking.rescheduleCount : 0;

  return (
    <main className="min-h-screen bg-black px-page py-hero">
      <div className="mx-auto max-w-2xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-gold">
          Manage Booking
        </p>
        <h1 className="mt-sm font-display text-[36px] tracking-[0.10em] text-white">
          Find Your Booking
        </h1>
        <p className="mt-sm font-body text-[13px] font-light text-muted">
          Enter your booking reference and the email you booked with.
        </p>

        <form onSubmit={handleLookup} className="mt-xl space-y-lg">
          <div>
            <label className="mb-sm block font-mono text-[10px] uppercase tracking-[0.15em] text-muted">
              Booking Reference
            </label>
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="LVH-XXXXXXXX"
              className="w-full rounded border border-border bg-surface px-md py-sm font-mono text-[13px] text-white outline-none focus:border-gold"
              required
            />
          </div>
          <div>
            <label className="mb-sm block font-mono text-[10px] uppercase tracking-[0.15em] text-muted">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded border border-border bg-surface px-md py-sm font-body text-[13px] text-white outline-none focus:border-gold"
              required
            />
          </div>
          {lookupError && (
            <p className="font-body text-[13px] text-red-400">{lookupError}</p>
          )}
          <Button type="submit" disabled={lookingUp} size="lg">
            {lookingUp ? "Searching..." : "Find booking"}
          </Button>
        </form>

        {booking && (
          <div className="mt-2xl border-t border-border pt-xl">
            <div className="rounded border border-border bg-surface p-lg">
              <p className="font-mono text-[9px] uppercase tracking-[0.10em] text-muted">
                {booking.reference}
              </p>
              <h2 className="mt-xs font-display text-[24px] tracking-[0.10em] text-white">
                {booking.hall.name}
              </h2>
              <p className="mt-xs font-mono text-[9px] uppercase tracking-[0.10em] text-muted">
                {booking.package.name}
              </p>
              <p className="mt-xs font-body text-[13px] text-muted">
                {new Date(booking.date).toLocaleDateString("en-NG", {
                  weekday: "long",
                  month: "long",
                  day: "numeric"
                })}{" "}
                · {booking.startTime} to {booking.endTime} · {booking.guestCount} guests
              </p>
              <p className="mt-xs font-mono text-[9px] uppercase tracking-[0.10em] text-gold">
                {booking.paymentStatus === "PAID" ? booking.status : booking.paymentStatus}
              </p>
            </div>

            {!eligible && (
              <p className="mt-lg font-body text-[13px] text-muted">
                {booking.status === "RESCHEDULED"
                  ? "This booking has already been rescheduled."
                  : booking.rescheduleCount >= MAX_RESCHEDULES_PER_BOOKING
                  ? `This booking has already been rescheduled ${MAX_RESCHEDULES_PER_BOOKING} times, the maximum allowed. Please contact us directly for anything further.`
                  : "This booking isn't eligible for rescheduling."}
              </p>
            )}

            {eligible && (
              <form onSubmit={handleReschedule} className="mt-xl space-y-lg">
                <h3 className="font-display text-[20px] tracking-[0.10em] text-white">
                  Reschedule
                </h3>
                <div className="rounded border border-border bg-surface p-md">
                  <p className="font-mono text-[9px] uppercase tracking-[0.10em] text-muted">
                    Rescheduling costs {formatNaira(RESCHEDULE_FEE)} and your new
                    date must fall within {RESCHEDULE_WINDOW_DAYS} days of your
                    original booking date. You have {remaining} reschedule
                    {remaining === 1 ? "" : "s"} left on this booking. No
                    cancellations or refunds apply either way.
                  </p>
                </div>

                <div>
                  <label className="mb-sm block font-mono text-[10px] uppercase tracking-[0.15em] text-muted">
                    New Date
                  </label>
                  <input
                    type="date"
                    min={minDate}
                    max={maxDate}
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full rounded border border-border bg-surface px-md py-sm font-body text-[13px] text-white outline-none focus:border-gold"
                    required
                  />
                </div>

                {newDate && (
                  <div>
                    <label className="mb-sm block font-mono text-[10px] uppercase tracking-[0.15em] text-muted">
                      Available Times
                    </label>
                    {loadingSlots && (
                      <p className="font-body text-[13px] text-muted">Loading times...</p>
                    )}
                    {!loadingSlots && slots.length > 0 && (
                      <div className="flex flex-wrap gap-sm">
                        {slots.map((slot) => (
                          <button
                            type="button"
                            key={slot.startTime}
                            disabled={!slot.available}
                            onClick={() => setNewStartTime(slot.startTime)}
                            className={`rounded-pill border px-lg py-sm font-mono text-[10px] uppercase tracking-[0.15em] transition ${
                              !slot.available
                                ? "cursor-not-allowed border-border text-muted/40 line-through"
                                : newStartTime === slot.startTime
                                ? "border-gold bg-gold-dim text-gold"
                                : "border-border text-muted hover:border-gold/40 hover:text-gold"
                            }`}
                          >
                            {slot.startTime}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {rescheduleError && (
                  <p className="font-body text-[13px] text-red-400">{rescheduleError}</p>
                )}

                <Button type="submit" disabled={submitting || !newStartTime} size="lg">
                  {submitting
                    ? "Redirecting..."
                    : `Pay ${formatNaira(RESCHEDULE_FEE)} and reschedule`}
                </Button>
              </form>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
