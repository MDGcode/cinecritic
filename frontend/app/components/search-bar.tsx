"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
}

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 2) {
      searchMovies(value);
    } else {
      setResults([]);
    }
  };

  const searchMovies = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      const encodedQuery = encodeURIComponent(searchQuery);
      const url = `https://api.themoviedb.org/3/search/movie?query=${encodedQuery}&include_adult=false&language=en-US&page=1`;
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
        setResults(data.results.slice(0, 5)); // Limit to 5 results
        setShowResults(true);
      }
    } catch (err) {
      console.error("Error searching movies:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setShowResults(false);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setShowResults(false);
  };

  const formatYear = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).getFullYear();
  };

  return (
    <div className="relative" ref={searchRef}>
      <form onSubmit={handleSearchSubmit}>
        <div className="relative">
          <input
            type="text"
            placeholder="Search movies..."
            value={query}
            onChange={handleSearchChange}
            onFocus={() => query.length > 2 && setShowResults(true)}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />

          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>

      {/* Search Results Dropdown */}
      {showResults && (
        <div className="absolute z-50 mt-1 w-full bg-white rounded-md shadow-lg max-h-96 overflow-y-auto border border-gray-200">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">Searching...</div>
          ) : results.length > 0 ? (
            <div>
              <ul>
                {results.map((movie) => (
                  <li
                    key={movie.id}
                    className="border-b border-gray-100 last:border-b-0"
                  >
                    <Link
                      href={`/movie/${movie.id}`}
                      className="flex items-center p-3 hover:bg-gray-50 transition-colors"
                      onClick={() => setShowResults(false)}
                    >
                      <div className="relative w-10 h-14 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                        {movie.poster_path ? (
                          <Image
                            src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                            alt={movie.title}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                            No image
                          </div>
                        )}
                      </div>
                      <div className="ml-3 flex-grow">
                        <p className="font-medium text-gray-800">
                          {movie.title}
                        </p>
                        {movie.release_date && (
                          <p className="text-sm text-gray-500">
                            {formatYear(movie.release_date)}
                          </p>
                        )}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : query.length > 2 ? (
            <div className="p-4 text-center text-gray-500">No movies found</div>
          ) : null}
        </div>
      )}
    </div>
  );
}
