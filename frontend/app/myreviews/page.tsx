"use client";

import { useEffect, useState } from "react";
import { Loader2, Trash } from "lucide-react"; // Import Trash icon
import Image from "next/image";
import Link from "next/link";
import { UserAuth } from "../context/AuthContext";

// Define the shape of the review data
interface Review {
  review_id: number;
  movie_id: number;
  user_id: string;
  rating: number;
  title: string;
  content: string;
}

interface Movie {
  poster_path: string | null;
}

export default function MyReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [posterUrls, setPosterUrls] = useState<{ [key: number]: string }>({});
  const [userId, setUserId] = useState<string | null>(null); // Assuming you have the userId available
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null); // New state to track which review is being deleted
  const { user } = UserAuth(); // Firebase user object

  useEffect(() => {
    const currentUserId = user?.uid;
    setUserId(currentUserId ?? null);
    console.log(user);
  }, [user]);

  // Fetch user reviews
  useEffect(() => {
    if (userId) {
      async function fetchReviews() {
        try {
          const response = await fetch(
            `https://4b73e3ed-b20c-40d1-9a6b-bf6be4287be5.eu-central-1.cloud.genez.io/api/reviews/user/${userId}`
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
    }
  }, [userId]);

  // Fetch movie poster using TMDB API
  const fetchMoviePoster = async (movieId: number): Promise<string> => {
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
      return movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : "/placeholder.svg";
    } catch (error) {
      console.error("Error fetching movie poster:", error);
      return "/placeholder.svg";
    }
  };

  // Fetch all poster URLs for user reviews
  useEffect(() => {
    async function fetchPosters() {
      const urls: { [key: number]: string } = {};
      for (const review of reviews) {
        if (!urls[review.movie_id]) {
          urls[review.movie_id] = await fetchMoviePoster(review.movie_id);
        }
      }
      setPosterUrls(urls);
    }

    if (reviews.length > 0) {
      fetchPosters();
    }
  }, [reviews]);

  // Function to delete a review
  const deleteReview = async (reviewId: number) => {
    setDeleteLoading(reviewId); // Set loading state for the specific review
    try {
      const response = await fetch(
        `https://4b73e3ed-b20c-40d1-9a6b-bf6be4287be5.eu-central-1.cloud.genez.io/api/reviews/${reviewId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        // Remove the deleted review from the UI
        setReviews((prevReviews) =>
          prevReviews.filter((review) => review.review_id !== reviewId)
        );
      } else {
        console.error("Failed to delete review");
      }
    } catch (error) {
      console.error("Error deleting review:", error);
    } finally {
      setDeleteLoading(null); // Reset the loading state
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h2 className="text-3xl font-bold mb-6">My Reviews</h2>

      {loading ? (
        <div className="flex justify-center items-center">
          <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
        </div>
      ) : reviews.length === 0 ? (
        <p>No reviews found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div
              key={review.review_id}
              className="border p-4 rounded-lg shadow-md"
            >
              <div className="flex items-start gap-6">
                {/* Left side: Movie poster */}
                <div className="flex-shrink-0">
                  <Image
                    src={posterUrls[review.movie_id] || "/placeholder.svg"}
                    alt={review.title}
                    width={100}
                    height={150}
                    className="object-cover rounded-md"
                  />
                </div>

                {/* Right side: Review content */}
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    {/* Display user's photo and name */}
                    <div className="flex-shrink-0 mr-4">
                      <Image
                        src={user?.photoURL || "/placeholder-profile.png"}
                        alt={user?.displayName || "User"}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    </div>
                    <div>
                      <p className="font-semibold">
                        {user?.displayName || "Anonymous"}
                      </p>
                    </div>
                    {/* Delete Icon with Spinner */}
                    <button
                      onClick={() => deleteReview(review.review_id)}
                      className="text-red-500 ml-auto cursor-pointer"
                      disabled={deleteLoading === review.review_id} // Disable button if delete is in progress
                    >
                      {deleteLoading === review.review_id ? (
                        <Loader2 className="animate-spin h-5 w-5 text-red-500" />
                      ) : (
                        <Trash size={20} />
                      )}
                    </button>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{review.title}</h3>
                  <p className="mb-4">{review.content}</p>
                  <div className="flex items-center mb-4">
                    <span className="ml-4 text-yellow-500">
                      {review.rating} / 10
                    </span>
                  </div>
                  <Link
                    href={`/movie/${review.movie_id}`}
                    className="text-blue-600 hover:underline mt-4 block text-center"
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
