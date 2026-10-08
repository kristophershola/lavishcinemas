import { getMovies } from "@/lib/movies";
import { getFeaturedMovieTmdbId } from "@/lib/settings";
import AdminNav from "@/components/AdminNav";
import FeaturedMoviePicker from "@/components/FeaturedMoviePicker";

export const dynamic = "force-dynamic";

export default async function AdminFeaturedMoviePage() {
  const [movies, currentTmdbId] = await Promise.all([
    getMovies(),
    getFeaturedMovieTmdbId()
  ]);

  return (
    <main className="min-h-screen bg-black">
      <AdminNav active="featured" />

      <div className="mx-auto max-w-7xl px-page py-xl">
        <h1 className="font-display text-[28px] tracking-[0.10em] text-white">
          Featured Movie
        </h1>
        <p className="mt-sm max-w-xl font-body text-[13px] font-light text-muted">
          This controls which film shows in the home page's "Now Showing"
          section, along with its Hall 1 and Hall 2 timeslots. Leave nothing
          selected and the site just falls back to the first movie in the feed.
        </p>

        <FeaturedMoviePicker movies={movies} currentTmdbId={currentTmdbId} />
      </div>
    </main>
  );
}
