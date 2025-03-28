import MovieGrid from "./components/movie-grid";
import TrendingMovies from "./components/trending-movies";

export default function DiscoverPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="flex justify-center text-3xl font-bold mb-6">
        Discover Movies
      </h1>
      <TrendingMovies />
      <h2 className="text-2xl font-bold mb-4">Popular Movies</h2>
      <MovieGrid />
    </div>
  );
}
