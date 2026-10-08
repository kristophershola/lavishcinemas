"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Movie } from "@/lib/movies";

export default function FeaturedMoviePicker({
  movies,
  currentTmdbId
}: {
  movies: Movie[];
  currentTmdbId: number | null;
}) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<number | null>(currentTmdbId);
  const [saving, setSaving] = useState(false);

  const filtered = movies.filter((m) =>
    m.title.toLowerCase().includes(search.toLowerCase())
  );

  async function choose(tmdbId: number | null) {
    setSaving(true);
    setSelected(tmdbId);
    await fetch("/api/admin/featured-movie", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tmdbId })
    });
    setSaving(false);
    router.refresh();
  }

  const currentMovie = movies.find((m) => m.tmdbId === selected) ?? null;

  return (
    <div className="mt-xl">
      <div className="flex items-center gap-md rounded border border-gold/40 bg-gold-dim p-md">
        {currentMovie ? (
          <>
            {currentMovie.poster && (
              <img
                src={currentMovie.poster}
                alt={currentMovie.title}
                className="h-20 w-14 rounded object-cover"
              />
            )}
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.10em] text-gold">
                Currently Featured
              </p>
              <p className="font-body text-[14px] text-white">{currentMovie.title}</p>
            </div>
            <Button
              variant="link"
              size="sm"
              onClick={() => choose(null)}
              disabled={saving}
              className="ml-auto shrink-0 text-muted normal-case tracking-normal hover:text-gold"
            >
              Clear (use default)
            </Button>
          </>
        ) : (
          <p className="font-body text-[13px] text-muted">
            No override set, showing the first movie in the feed by default.
          </p>
        )}
      </div>

      <input
        type="text"
        placeholder="Search titles..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mt-xl w-full max-w-xs rounded border border-border bg-surface px-md py-sm font-body text-[13px] text-white outline-none focus:border-gold"
      />

      <div className="mt-lg grid grid-cols-2 gap-lg sm:grid-cols-4 lg:grid-cols-6">
        {filtered.map((movie) => {
          const isSelected = movie.tmdbId === selected;
          return (
            <button
              key={movie.tmdbId}
              onClick={() => choose(movie.tmdbId)}
              disabled={saving}
              className={`overflow-hidden rounded border text-left transition disabled:opacity-60 ${
                isSelected ? "border-gold" : "border-border hover:border-gold/40"
              }`}
            >
              <div className="aspect-[2/3] w-full overflow-hidden bg-deep">
                {movie.poster && (
                  <img src={movie.poster} alt={movie.title} className="h-full w-full object-cover" />
                )}
              </div>
              <div className="p-sm">
                <p className="truncate font-body text-[11px] font-medium uppercase text-white">
                  {movie.title}
                </p>
                <p className="mt-xs font-mono text-[9px] uppercase tracking-[0.10em] text-muted">
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
