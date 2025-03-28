"use client";

import { useEffect, useState } from "react";
import { Loader2, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  release_date: string;
  overview: string | null;
}

export default function MovieGrid() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const url =
          "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc";
        const options = {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_KEY}`,
          },
        };

        const response = await fetch(url, options);
        const data = await response.json();

        if (data.results) {
          setMovies(data.results);
        } else {
          setError("Failed to fetch movies");
        }
      } catch (err) {
        setError("An error occurred while fetching movies");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (error) {
    return <div className="text-center text-red-500 my-8">{error}</div>;
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-4" />
        <p className="text-gray-500">Loading movies...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {movies.map((movie) => (
          <Link
            href={`/movie/${movie.id}`}
            key={movie.id}
            className="block h-full"
          >
            <div className="overflow-hidden h-full flex flex-col rounded-lg border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer bg-white">
              <div className="relative aspect-[2/3] w-full">
                {movie.poster_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-500">No image</span>
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <span className="flex items-center gap-1 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    {movie.vote_average.toFixed(1)}
                  </span>
                </div>
              </div>
              <div className="flex-grow flex flex-col p-4">
                <h3 className="font-semibold text-lg line-clamp-1">
                  {movie.title}
                </h3>
                <p className="text-sm text-gray-500 mb-2">
                  {movie.release_date
                    ? new Date(movie.release_date).getFullYear()
                    : "Unknown"}
                </p>
                <p className="text-sm line-clamp-3 text-gray-500 mt-auto">
                  {movie.overview || "No description available."}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
