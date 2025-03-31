"use client";
import { useState, useEffect } from "react";
import { Loader2, Star, MessageCircle } from "lucide-react";
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
  comments: Comment[];
}

export function ReviewsList({ movieId }: { movieId: number }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedReviews, setExpandedReviews] = useState<number[]>([]);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/api/reviews/movie/${movieId}`
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

  const toggleExpandReview = (reviewId: number) => {
    setExpandedReviews((prev) =>
      prev.includes(reviewId)
        ? prev.filter((id) => id !== reviewId)
        : [...prev, reviewId]
    );
  };

  const isReviewExpanded = (reviewId: number) => {
    return expandedReviews.includes(reviewId);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
      </div>
    );
  }

  return (
    <div className="mt-8 px-4 sm:px-6 md:px-8 max-w-4xl mx-auto mb-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
        <MessageCircle className="mr-2 h-6 w-6 text-blue-600" />
        User Reviews
      </h2>

      {reviews.length === 0 ? (
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 text-center">
          <p className="text-blue-800 font-medium">
            No reviews yet. Be the first to review!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div
              key={review.review_id}
              className="border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow bg-white overflow-hidden"
            >
              {/* Review Header */}
              <div className="bg-gradient-to-r from-blue-50 to-white p-4 border-b border-gray-100">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative h-12 w-12 rounded-full overflow-hidden border-2 border-white shadow-sm">
                    <Image
                      src={review.photoUrl || "/placeholder-profile.png"}
                      alt={review.displayname || "User"}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div className="flex-grow">
                    <p className="font-semibold text-gray-800">
                      {review.displayname}
                    </p>
                    <div className="flex items-center mt-1">
                      <div className="flex items-center bg-blue-600 text-white px-2 py-0.5 rounded-md text-sm">
                        <Star className="h-3.5 w-3.5 mr-1 fill-yellow-300 text-yellow-300" />
                        <span className="font-medium">{review.rating}</span>
                        <span className="text-xs text-blue-100 ml-0.5">
                          /10
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Review Content */}
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {review.title}
                </h3>
                <p
                  className={`text-gray-600 leading-relaxed ${
                    !isReviewExpanded(review.review_id) &&
                    review.content.length > 300
                      ? "line-clamp-4"
                      : ""
                  }`}
                >
                  {review.content}
                </p>

                {review.content.length > 300 && (
                  <button
                    onClick={() => toggleExpandReview(review.review_id)}
                    className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium focus:outline-none"
                  >
                    {isReviewExpanded(review.review_id)
                      ? "Show less"
                      : "Read more"}
                  </button>
                )}

                {/* Interactive Elements */}
              </div>

              {/* Comments Section */}
              {review.comments.length > 0 && (
                <div className="mt-2 bg-gray-50 p-4 border-t border-gray-100">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <MessageCircle className="h-4 w-4 mr-1 text-blue-500" />
                    Comments ({review.comments.length})
                  </h4>

                  <div className="space-y-3">
                    {review.comments.map((comment) => (
                      <div
                        key={comment.comment_id}
                        className="flex items-start gap-3"
                      >
                        <div className="relative h-8 w-8 rounded-full overflow-hidden flex-shrink-0 border border-white">
                          <Image
                            src={comment.photoUrl || "/placeholder-profile.png"}
                            alt={comment.displayname || "User"}
                            fill
                            className="object-cover"
                            sizes="32px"
                          />
                        </div>
                        <div className="flex-grow bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                          <p className="font-medium text-sm text-gray-800">
                            {comment.displayname}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {comment.comment}
                          </p>
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
