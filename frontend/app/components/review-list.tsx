"use client";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import Image from "next/image";
interface Comment {
  comment_id: number;
  review_id: number;
  user_id: string;
  comment: string;
  displayname: string;
  photoUrl: string;
}

interface Review {
  review_id: number;
  movie_id: number;
  user_id: string;
  rating: number;
  title: string;
  content: string;
  photoUrl: string;
  displayname: string;
  comments: Comment[]; // Add this line
}
export function ReviewsList({ movieId }: { movieId: number }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const response = await fetch(
          `https://4b73e3ed-b20c-40d1-9a6b-bf6be4287be5.eu-central-1.cloud.genez.io/api/reviews/movie/${movieId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch reviews");
        }
        const data = await response.json();
        setReviews(data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchReviews();
  }, [movieId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="animate-spin h-10 w-10 text-blue-500" />
      </div>
    );
  }

  return (
    <div className="mt-8 mx-8">
      <h2 className="text-2xl font-semibold mb-4">User Reviews</h2>
      {reviews.length === 0 ? (
        <p className="text-gray-500">No reviews yet. Be the first to review!</p>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div
              key={review.review_id}
              className="border p-4 rounded-lg shadow-md"
            >
              <div className="flex items-center gap-4 mb-4">
                <Image
                  src={review.photoUrl || "/placeholder-profile.png"}
                  alt={review.displayname || "User"}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div>
                  <p className="font-semibold">{review.displayname}</p>
                  <p className="text-sm text-gray-500">
                    Rated: {review.rating} / 10
                  </p>
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-1">{review.title}</h3>
              <p className="mb-2">{review.content}</p>
              {review.comments.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-md font-semibold">Comments</h4>
                  <div className="space-y-2 mt-2">
                    {review.comments.map((comment) => (
                      <div
                        key={comment.comment_id}
                        className="flex items-start gap-2"
                      >
                        <Image
                          src={comment.photoUrl || "/placeholder-profile.png"}
                          alt={comment.displayname || "User"}
                          width={30}
                          height={30}
                          className="rounded-full"
                        />
                        <div className="bg-gray-100 p-2 rounded-lg">
                          <p className="font-semibold">{comment.displayname}</p>
                          <p>{comment.comment}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
