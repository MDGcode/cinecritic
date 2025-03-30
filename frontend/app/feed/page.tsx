"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Loader2 } from "lucide-react";

// Define the shape of the review data
interface Review {
  review_id: number;
  movie_id: number;
  user_id: string;
  rating: number;
  title: string; // Review title
  content: string;
}

interface Movie {
  title: string;
  poster_path: string | null;
}

export default function Feed() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [posterUrls, setPosterUrls] = useState<{ [key: number]: string }>({});
  const [movieTitles, setMovieTitles] = useState<{ [key: number]: string }>({});

  // Fetch reviews data
  useEffect(() => {
    async function fetchReviews() {
      try {
        const response = await fetch(
          "https://4b73e3ed-b20c-40d1-9a6b-bf6be4287be5.eu-central-1.cloud.genez.io/api/reviews"
        );
        const data: Review[] = await response.json();
        setReviews(data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchReviews();
  }, []);

  // Fetch movie poster and title using TMDB API
  const fetchMovieDetails = async (movieId: number): Promise<Movie> => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_KEY}`,
          },
        }
      );

      const movie: Movie = await response.json();
      return {
        title: movie.title,
        poster_path: movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : "/placeholder.svg",
      };
    } catch (error) {
      console.error("Error fetching movie details:", error);
      return { title: "Unknown Movie", poster_path: "/placeholder.svg" };
    }
  };

  // Fetch all poster URLs and movie titles on mount
  useEffect(() => {
    async function fetchPostersAndTitles() {
      const urls: { [key: number]: string } = {};
      const titles: { [key: number]: string } = {};
      for (const review of reviews) {
        if (!urls[review.movie_id] || !titles[review.movie_id]) {
          const movie = await fetchMovieDetails(review.movie_id);
          urls[review.movie_id] = movie.poster_path || "/placeholder.svg";
          titles[review.movie_id] = movie.title;
        }
      }
      setPosterUrls(urls);
      setMovieTitles(titles);
    }

    if (reviews.length > 0) {
      fetchPostersAndTitles();
    }
  }, [reviews]);

  return (
    <div className="container mx-auto py-8 px-4">
      <h2 className="text-3xl font-bold mb-6">Movie Reviews</h2>

      {loading ? (
        <div className="flex justify-center items-center">
          <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div
              key={review.review_id}
              className="border p-4 rounded-lg shadow-md"
            >
              <div className="flex items-start gap-6">
                {/* Left side: Movie poster and title */}
                <div className="flex-shrink-0">
                  <Image
                    src={posterUrls[review.movie_id] || "/placeholder.svg"}
                    alt={movieTitles[review.movie_id] || "Movie"}
                    width={100}
                    height={150}
                    className="object-cover rounded-md"
                  />
                </div>

                {/* Right side: Review content */}
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">
                    {movieTitles[review.movie_id] || "Movie Title"}
                  </h3>
                  <h4 className="text-lg font-medium mb-2 text-gray-700">
                    {review.title} {/* Review title */}
                  </h4>
                  <p className="mb-4">{review.content}</p>
                  <div className="flex items-center mb-4">
                    <span className="ml-4 text-yellow-500">
                      {review.rating} / 10
                    </span>
                  </div>
                  <Link
                    href={`/movie/${review.movie_id}`}
                    className="text-blue-600 hover:underline"
                  >
                    View Movie Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
