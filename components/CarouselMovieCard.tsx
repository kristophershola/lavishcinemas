import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Movie } from "@/lib/movies";

export default function CarouselMovieCard({ movie }: { movie: Movie }) {
  const bookHref = `/book/datetime?movieTitle=${encodeURIComponent(
    movie.title
  )}&moviePoster=${encodeURIComponent(movie.poster ?? "")}&movieTmdbId=${movie.tmdbId}`;

  return (
    <div className="group w-[200px] shrink-0">
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded border border-border bg-deep">
        {movie.poster ? (
          <img
            src={movie.poster}
            alt={movie.title}
            className="h-full w-full object-cover transition duration-300 group-hover:brightness-[0.4]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-deep">
            <span className="font-mono text-[11px] uppercase tracking-[0.10em] text-muted">
              No Poster
            </span>
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 translate-y-full opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <Button asChild className="w-full rounded-none">
            <Link href={bookHref}>Book a Hall</Link>
          </Button>
        </div>
      </div>

      <p className="mt-sm truncate font-body text-[13px] font-medium uppercase text-white">
        {movie.title}
      </p>
      <p className="mt-xs font-mono text-[11px] uppercase tracking-[0.15em] text-muted">
        {movie.year}
      </p>
    </div>
  );
}
