import Link from "next/link";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { getMovies } from "@/lib/movies";
import { getFeaturedMovieTmdbId } from "@/lib/settings";
import HeroCarousel from "@/components/HeroCarousel";
import FeaturedFilmSection from "@/components/FeaturedFilmSection";
import MovieCarousel from "@/components/MovieCarousel";
import HowItWorks from "@/components/HowItWorks";

export const revalidate = 60;

export default async function HomePage() {
  const [halls, movies, featuredTmdbId] = await Promise.all([
    prisma.hall.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" }
    }),
    getMovies(),
    getFeaturedMovieTmdbId()
  ]);

  const featured =
    (featuredTmdbId ? movies.find((m) => m.tmdbId === featuredTmdbId) : null) ?? movies[0];
  const carouselMovies = movies.filter((m) => m.tmdbId !== featured?.tmdbId).slice(0, 8);

  return (
    <main className="min-h-screen bg-black">
      <HeroCarousel />

      {featured && (
        <FeaturedFilmSection
          movie={featured}
          halls={halls.map((h) => ({ id: h.id, name: h.name }))}
        />
      )}

      <section className="pb-hero pt-lg">
        <div className="mx-auto max-w-7xl px-page">
          {carouselMovies.length === 0 && (
            <p className="font-body text-[14px] text-muted">
              Nothing to show right now, check back shortly.
            </p>
          )}

          {carouselMovies.length > 0 && <MovieCarousel movies={carouselMovies} />}

          <div className="mt-xl text-center">
            <Button asChild variant="outline">
              <Link href="/now-showing">See All Movies</Link>
            </Button>
          </div>
        </div>
      </section>

      <HowItWorks />
    </main>
  );
}
