// Pulls the shared Now Showing feed. This is not our database, it's a
// JSON file kept up to date by the separate movie-updater project, so we
// just fetch and normalize it, no writes ever happen from this app.

const MOVIES_JSON_URL =
  "https://raw.githubusercontent.com/kristophershola/movie-updater/main/movies.json";

export type Movie = {
  title: string;
  genres: string;
  poster: string | null;
  overview: string;
  rating: number;
  year: string;
  releaseDate: string;
  tmdbId: number;
};

type RawFeed = {
  generated: string;
  movies: Array<{
    title: string;
    genres?: string;
    poster?: string | null;
    overview?: string;
    rating?: number;
    year?: string;
    release_date?: string;
    tmdb_id?: number;
  }>;
};

export async function getMovies(): Promise<Movie[]> {
  try {
    const res = await fetch(MOVIES_JSON_URL, { next: { revalidate: 300 } });
    if (!res.ok) return [];

    const data = (await res.json()) as RawFeed;
    if (!Array.isArray(data.movies)) return [];

    return data.movies.map((m) => ({
      title: m.title,
      genres: m.genres ?? "",
      poster: m.poster ?? null,
      overview: m.overview ?? "",
      rating: m.rating ?? 0,
      year: m.year ?? "",
      releaseDate: m.release_date ?? "",
      tmdbId: m.tmdb_id ?? 0
    }));
  } catch {
    return [];
  }
}

export async function getMovieByTmdbId(tmdbId: number): Promise<Movie | null> {
  const movies = await getMovies();
  return movies.find((m) => m.tmdbId === tmdbId) ?? null;
}
