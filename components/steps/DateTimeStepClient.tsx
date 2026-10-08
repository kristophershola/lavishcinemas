"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useBooking } from "@/lib/bookingContext";
import { Button } from "@/components/ui/button";
import DatePicker from "@/components/DatePicker";

type Hall = { id: string; name: string; slug: string; capacity: number; description: string | null };
type Slot = { startTime: string; endTime: string; available: boolean };

export default function DateTimeStepClient({ halls }: { halls: Hall[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { draft, update, hydrated } = useBooking();
  const [seeded, setSeeded] = useState(false);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  useEffect(() => {
    if (!hydrated || seeded) return;
    const dateParam = searchParams.get("date");
    const movieTitle = searchParams.get("movieTitle");
    const patch: Record<string, unknown> = {};
    if (dateParam) patch.date = dateParam;
    if (movieTitle) {
      patch.movieTitle = movieTitle;
      patch.moviePosterUrl = searchParams.get("moviePoster") || null;
      patch.movieTmdbId = Number(searchParams.get("movieTmdbId")) || null;
      patch.movieSkipped = false;
    }
    if (Object.keys(patch).length > 0) update(patch);
    setSeeded(true);
  }, [hydrated, seeded, searchParams, update]);

  useEffect(() => {
    if (!draft.hallId || !draft.date) {
      setSlots([]);
      return;
    }
    setLoadingSlots(true);
    fetch(`/api/sessions?hallId=${draft.hallId}&date=${draft.date}`)
      .then((res) => res.json())
      .then((json) => setSlots(json.slots ?? []))
      .finally(() => setLoadingSlots(false));
  }, [draft.hallId, draft.date]);

  function pickHall(hall: Hall) {
    update({
      hallId: hall.id,
      hallName: hall.name,
      hallSlug: hall.slug,
      hallCapacity: hall.capacity,
      startTime: null,
      endTime: null,
      guestCount: Math.min(draft.guestCount, hall.capacity)
    });
  }

  function pickTime(slot: Slot) {
    if (!slot.available) return;
    update({ startTime: slot.startTime, endTime: slot.endTime });
  }

  const today = new Date().toISOString().split("T")[0];
  const canContinue = Boolean(draft.hallId && draft.date && draft.startTime);

  return (
    <div>
      <p className="font-mono text-[13px] font-medium uppercase tracking-[0.15em] text-gold">Step 1</p>
      <h1 className="mt-sm font-display text-[38px] tracking-[0.10em] text-white">
        Choose Your Hall, Date and Time
      </h1>
      <p className="mt-sm font-body text-[15px] font-light text-muted">
        Every session runs 2 hours 20 minutes, doors open right at the time you pick.
      </p>

      <div className="mt-xl">
        <label className="mb-md block font-mono text-[13px] font-medium uppercase tracking-[0.15em] text-muted">
          Hall
        </label>
        <div className="grid gap-lg sm:grid-cols-2 sm:max-w-2xl">
          {halls.map((hall) => {
            const selected = draft.hallId === hall.id;
            return (
              <button
                key={hall.id}
                onClick={() => pickHall(hall)}
                className={`rounded border-2 p-xl text-left transition ${
                  selected ? "border-gold bg-gold-dim" : "border-border bg-black/20 hover:border-gold/40"
                }`}
              >
                <h3 className="card-title font-body text-[18px] font-semibold uppercase text-white">
                  {hall.name}
                </h3>
                <p className="mt-xs font-mono text-[12px] uppercase tracking-[0.10em] text-muted">
                  Up to {hall.capacity} guests
                </p>
                {hall.description && (
                  <p className="mt-sm font-body text-[14px] font-light text-muted">
                    {hall.description}
                  </p>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-xl">
        <label className="mb-md block font-mono text-[13px] font-medium uppercase tracking-[0.15em] text-muted">
          Date
        </label>
        <DatePicker
          selectedDate={draft.date ?? ""}
          onSelect={(iso) => update({ date: iso, startTime: null, endTime: null })}
          minDate={today}
        />
      </div>

      {draft.hallId && draft.date && (
        <div className="mt-xl">
          <label className="mb-md block font-mono text-[13px] font-medium uppercase tracking-[0.15em] text-muted">
            Available Times
          </label>
          {loadingSlots && <p className="font-body text-[15px] text-muted">Loading times...</p>}
          {!loadingSlots && (
            <div className="flex flex-wrap gap-md">
              {slots.map((slot) => (
                <button
                  key={slot.startTime}
                  disabled={!slot.available}
                  onClick={() => pickTime(slot)}
                  className={`rounded-pill border-2 px-xl py-md font-mono text-[13px] font-medium uppercase tracking-[0.15em] transition ${
                    !slot.available
                      ? "cursor-not-allowed border-border text-muted/40 line-through"
                      : draft.startTime === slot.startTime
                      ? "border-gold bg-gold text-black"
                      : "border-border text-muted hover:border-gold/50 hover:text-gold"
                  }`}
                >
                  {slot.startTime}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {!draft.hallId && (
        <p className="mt-xl font-body text-[15px] text-muted">
          Pick a hall to see available times.
        </p>
      )}

      <Button
        onClick={() => router.push("/book/movie")}
        disabled={!canContinue}
        size="lg"
        className="mt-2xl"
      >
        Continue
      </Button>
    </div>
  );
}
