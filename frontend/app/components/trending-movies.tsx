"use client";

import { useEffect, useState } from "react";
import { Loader2, Star, TrendingUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date: string;
  overview: string | null;
}

export default function TrendingMovies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrendingMovies = async () => {
      setLoading(true);
      try {
        const url =
          "https://api.themoviedb.org/3/trending/movie/day?language=en-US";
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
          setMovies(data.results.slice(0, 5)); // Get top 5 trending movies
        } else {
          setError("Failed to fetch trending movies");
        }
      } catch (err) {
        setError("An error occurred while fetching trending movies");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingMovies();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500 mr-2" />
        <p className="text-gray-500">Loading trending movies...</p>
      </div>
    );
  }

  if (error || movies.length === 0) {
    return null; // Don't show section if there's an error or no movies
  }

  return (
    <div className="mb-10">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="h-5 w-5 text-red-500" />
        <h2 className="text-2xl font-bold">Trending Today</h2>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {movies.map((movie) => (
          <Link href={`/movie/${movie.id}`} key={movie.id} className="block">
            <div className="relative overflow-hidden rounded-lg border border-gray-200 hover:shadow-lg transition-shadow bg-white">
              <div className="flex flex-col md:flex-row">
                {/* Poster for mobile, hidden on larger screens */}
                <div className="relative w-full h-[200px] md:hidden">
                  {movie.backdrop_path ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w780${movie.backdrop_path}`}
                      alt={movie.title}
                      fill
                      className="object-cover"
                      sizes="100vw"
                    />
                  ) : movie.poster_path ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                      fill
                      className="object-cover"
                      sizes="100vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-500">No image</span>
                    </div>
                  )}
                </div>

                {/* Poster for desktop */}
                <div className="hidden md:block relative w-[150px] h-[225px] flex-shrink-0">
                  {movie.poster_path ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                      fill
                      className="object-cover"
                      sizes="150px"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-500">No image</span>
                    </div>
                  )}
                </div>

                {/* Backdrop for desktop */}
                <div className="hidden md:block relative flex-grow h-[225px]">
                  {movie.backdrop_path ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`}
                      alt={movie.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 70vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100"></div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-l from-transparent via-black/60 to-black/80"></div>
                </div>

                {/* Content overlay */}
                <div className="md:absolute inset-0 flex flex-col justify-center p-4 md:p-6 md:pl-[170px]">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="flex items-center gap-1 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      {movie.vote_average.toFixed(1)}
                    </span>
                    <span className="text-sm text-gray-600 md:text-gray-300">
                      {movie.release_date
                        ? new Date(movie.release_date).getFullYear()
                        : "Unknown"}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold md:text-white mb-2">
                    {movie.title}
                  </h3>
                  <p className="text-sm text-gray-600 md:text-gray-200 line-clamp-2 md:max-w-[70%]">
                    {movie.overview || "No description available."}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
