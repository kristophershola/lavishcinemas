import { getMovies } from "@/lib/movies";
import MovieCard from "@/components/MovieCard";

export const revalidate = 300;

export default async function NowShowingPage() {
  const movies = await getMovies();

  return (
    <main className="min-h-screen bg-black">
      <section className="mx-auto max-w-6xl px-page py-hero">
        <p className="font-mono text-[12px] uppercase tracking-[0.15em] text-gold">
          Now Showing
        </p>
        <h1 className="mt-sm font-display text-[52px] tracking-[0.10em] text-white">
          Pick Something Worth The Hall
        </h1>
        <p className="mt-sm max-w-lg font-body text-[15px] font-light text-muted">
          Browse what's playing and lock in your film before you book, or
          skip this and choose once you're in your seat.
        </p>

        {movies.length === 0 && (
          <p className="mt-xl font-body text-[14px] text-muted">
            Nothing to show right now, check back shortly.
          </p>
        )}

        <div className="mt-xl grid grid-cols-2 gap-lg sm:grid-cols-3 lg:grid-cols-5">
          {movies.map((movie) => (
            <MovieCard key={movie.tmdbId} movie={movie} />
          ))}
        </div>
      </section>
    </main>
  );
}
