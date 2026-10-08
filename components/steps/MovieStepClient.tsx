"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useBooking } from "@/lib/bookingContext";
import { Button } from "@/components/ui/button";
import { Movie } from "@/lib/movies";

export default function MovieStepClient({ movies }: { movies: Movie[] }) {
  const router = useRouter();
  const { draft, update } = useBooking();
  const [search, setSearch] = useState("");

  const filtered = movies.filter((m) =>
    m.title.toLowerCase().includes(search.toLowerCase())
  );

  function choose(movie: Movie) {
    update({
      movieTitle: movie.title,
      moviePosterUrl: movie.poster,
      movieTmdbId: movie.tmdbId,
      movieSkipped: false
    });
    router.push("/book/package");
  }

  function skip() {
    update({ movieTitle: null, moviePosterUrl: null, movieTmdbId: null, movieSkipped: true });
    router.push("/book/package");
  }

  return (
    <div>
      <p className="font-mono text-[13px] font-medium uppercase tracking-[0.15em] text-gold">Step 2</p>
      <h1 className="mt-sm font-display text-[38px] tracking-[0.10em] text-white">
        What Are You Watching?
      </h1>
      <p className="mt-sm font-body text-[15px] font-light text-muted">
        Pick a film now, or skip and decide once you're settled in.
      </p>

      {draft.movieTitle && (
        <div className="mt-lg flex items-center gap-md rounded border-2 border-gold bg-gold-dim p-lg">
          {draft.moviePosterUrl && (
            <img
              src={draft.moviePosterUrl}
              alt={draft.movieTitle}
              className="h-20 w-14 rounded object-cover"
            />
          )}
          <div>
            <p className="font-mono text-[12px] font-medium uppercase tracking-[0.10em] text-gold">Selected</p>
            <p className="font-body text-[16px] text-white">{draft.movieTitle}</p>
          </div>
        </div>
      )}

      <div className="mt-xl flex items-center justify-between gap-md">
        <input
          type="text"
          placeholder="Search titles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-xs rounded border-2 border-border bg-black/20 px-lg py-md font-body text-[15px] text-white outline-none focus:border-gold"
        />
        <Button variant="outline" onClick={skip} className="shrink-0">
          Skip, decide later
        </Button>
      </div>

      {movies.length === 0 && (
        <p className="mt-xl font-body text-[15px] text-muted">
          Couldn't load the current listing. You can still skip and choose on arrival.
        </p>
      )}

      <div className="mt-xl grid grid-cols-2 gap-lg sm:grid-cols-4 lg:grid-cols-6">
        {filtered.map((movie) => {
          const selected = draft.movieTitle === movie.title;
          return (
            <button
              key={movie.tmdbId}
              onClick={() => choose(movie)}
              className={`group overflow-hidden rounded border-2 text-left transition ${
                selected ? "border-gold" : "border-border hover:border-gold/40"
              }`}
            >
              <div className="aspect-[2/3] w-full overflow-hidden bg-deep">
                {movie.poster && (
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="h-full w-full object-cover transition group-hover:brightness-90"
                  />
                )}
              </div>
              <div className="p-md">
                <p className="card-title truncate font-body text-[13px] font-medium uppercase text-white">
                  {movie.title}
                </p>
                <p className="mt-xs font-mono text-[11px] uppercase tracking-[0.10em] text-muted">
                  {movie.year}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
