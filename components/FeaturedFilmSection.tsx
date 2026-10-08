"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import DayPicker from "@/components/DayPicker";
import { Movie } from "@/lib/movies";
import { seedBookingDraft } from "@/lib/bookingContext";

type Hall = { id: string; name: string };
type Slot = { startTime: string; endTime: string; available: boolean };

function todayIso() {
  return new Date().toISOString().split("T")[0];
}

export default function FeaturedFilmSection({
  movie,
  halls
}: {
  movie: Movie;
  halls: Hall[];
}) {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(todayIso());
  const [slotsByHall, setSlotsByHall] = useState<Record<string, Slot[]>>({});
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    if (halls.length === 0) return;
    setTransitioning(true);
    Promise.all(
      halls.map((hall) =>
        fetch(`/api/sessions?hallId=${hall.id}&date=${selectedDate}`)
          .then((res) => res.json())
          .then((json) => [hall.id, json.slots ?? []] as const)
      )
    )
      .then((results) => {
        setSlotsByHall(Object.fromEntries(results));
        setTransitioning(false);
      })
      .catch(() => setTransitioning(false));
  }, [halls, selectedDate]);

  function pickSlot(hall: Hall, slot: Slot) {
    if (!slot.available) return;
    seedBookingDraft({
      movieTitle: movie.title,
      moviePosterUrl: movie.poster,
      movieTmdbId: movie.tmdbId,
      movieSkipped: false,
      hallId: hall.id,
      hallName: hall.name,
      date: selectedDate,
      startTime: slot.startTime,
      endTime: slot.endTime
    });
    router.push("/book/package");
  }

  return (
    <section className="mx-auto max-w-7xl px-page pb-lg">
      <div className="mb-lg flex items-center justify-between">
        <h2 className="font-display text-[56px] tracking-[0.06em] text-white underline decoration-gold decoration-[3px] underline-offset-[12px]">
          Now Showing
        </h2>
        <Button asChild variant="outline" className="shrink-0">
          <Link href="/book">Book a Hall</Link>
        </Button>
      </div>

      <div className="rounded border border-border bg-surface p-xl sm:p-2xl">
        <p className="mb-sm font-mono text-[12px] uppercase tracking-[0.15em] text-muted">
          Pick A Date
        </p>
        <DayPicker selectedDate={selectedDate} onSelect={setSelectedDate} />

        <div className="mt-xl grid gap-2xl sm:grid-cols-[280px_1fr]">
          <div className="aspect-[2/3] w-full max-w-[280px] overflow-hidden rounded bg-deep">
            {movie.poster && (
              <img src={movie.poster} alt={movie.title} className="h-full w-full object-cover" />
            )}
          </div>

          <div>
            <h3 className="font-display text-[44px] leading-[1] tracking-[0.06em] text-white">
              {movie.title}
            </h3>
            <p className="mt-sm font-mono text-[12px] uppercase tracking-[0.15em] text-muted">
              {movie.year}
              {movie.genres ? ` · ${movie.genres.split(",").slice(0, 2).join(", ")}` : ""}
            </p>
            {movie.overview && (
              <p className="mt-md max-w-2xl font-body text-[15px] font-light leading-relaxed text-muted">
                {movie.overview}
              </p>
            )}

            <div
              className={`mt-2xl grid gap-xl sm:grid-cols-2 transition-opacity duration-200 ${
                transitioning ? "opacity-40" : "opacity-100"
              }`}
            >
              {halls.map((hall) => (
                <div key={hall.id}>
                  <p className="mb-sm font-mono text-[12px] uppercase tracking-[0.15em] text-white">
                    {hall.name}
                  </p>
                  <div className="flex flex-wrap gap-sm">
                    {(slotsByHall[hall.id] ?? []).map((slot) => (
                      <button
                        key={slot.startTime}
                        disabled={!slot.available || transitioning}
                        onClick={() => pickSlot(hall, slot)}
                        className={`rounded-pill border px-md py-sm font-mono text-[11px] uppercase tracking-[0.15em] transition ${
                          !slot.available
                            ? "cursor-not-allowed border-border text-muted/40 line-through"
                            : "border-border text-muted hover:border-gold/40 hover:text-gold"
                        }`}
                      >
                        {slot.startTime}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
