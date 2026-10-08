import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Movie } from "@/lib/movies";

export default function MovieCard({
  movie,
  size = "small"
}: {
  movie: Movie;
  size?: "large" | "small";
}) {
  const bookHref = `/book/datetime?movieTitle=${encodeURIComponent(
    movie.title
  )}&moviePoster=${encodeURIComponent(movie.poster ?? "")}&movieTmdbId=${movie.tmdbId}`;

  const large = size === "large";

  return (
    <div className="lavish-fade-up group relative overflow-hidden rounded border border-border bg-deep">
      <div className="relative aspect-[2/3] w-full overflow-hidden">
        {movie.poster ? (
          <img
            src={movie.poster}
            alt={movie.title}
            className="h-full w-full object-cover transition duration-300 group-hover:brightness-[0.45]"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-sm bg-deep">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border/40">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted">
                <rect x="2" y="3" width="12" height="10" rx="1" />
                <path d="M2 10l3-3 2 2 3-4 4 5" />
                <circle cx="5" cy="6" r="1" />
              </svg>
            </div>
            <span className="meta-mono font-mono text-[11px] uppercase text-muted">
              No Poster
            </span>
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 flex flex-col justify-end gap-sm bg-gradient-to-t from-black/90 via-black/20 to-transparent p-md opacity-0 transition duration-300 group-hover:opacity-100">
          {movie.overview && (
            <p className={`font-body leading-snug text-white/85 ${large ? "line-clamp-6 text-[13px]" : "line-clamp-4 text-[12px]"}`}>
              {movie.overview}
            </p>
          )}
        </div>
      </div>

      <div className={large ? "p-lg" : "p-md"}>
        <h3 className={`card-title truncate font-body font-medium uppercase text-white ${large ? "text-[15px]" : "text-[13px]"}`}>
          {movie.title}
        </h3>
        <p className="mt-xs font-mono text-[11px] uppercase tracking-[0.15em] text-muted">
          {movie.year}
          {movie.genres ? ` · ${movie.genres.split(",")[0]}` : ""}
        </p>
        <Button asChild variant="outline" size="sm" className="mt-sm w-full">
          <Link href={bookHref}>Book a Hall</Link>
        </Button>
      </div>
    </div>
  );
}
