import { getMovies } from "@/lib/movies";
import MovieStepClient from "@/components/steps/MovieStepClient";

export const revalidate = 300;

export default async function MovieStepPage() {
  const movies = await getMovies();
  return <MovieStepClient movies={movies} />;
}
