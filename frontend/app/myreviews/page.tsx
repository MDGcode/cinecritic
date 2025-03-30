"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { UserAuth } from "../context/AuthContext";
import ReviewCard from "../components/review-card"; // Import the new component

// Define the shape of the review data
interface Review {
  review_id: number;
  movie_id: number;
  user_id: string;
  rating: number;
  title: string;
  content: string;
  photoUrl: string;
  displayname: string;
}

export default function MyReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
  const { user } = UserAuth(); // Firebase user object

  useEffect(() => {
    if (user) {
      setUserId(user.uid);
    } else {
      setUserId(null);
    }
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

  // Function to delete a review
  const deleteReview = async (reviewId: number) => {
    setDeleteLoading(reviewId);
    try {
      const response = await fetch(
        `https://4b73e3ed-b20c-40d1-9a6b-bf6be4287be5.eu-central-1.cloud.genez.io/api/reviews/${reviewId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setReviews((prevReviews) =>
          prevReviews.filter((review) => review.review_id !== reviewId)
        );
      } else {
        console.error("Failed to delete review");
      }
    } catch (error) {
      console.error("Error deleting review:", error);
    } finally {
      setDeleteLoading(null);
    }
  };

  // If the user is not logged in, show a message
  if (!user) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">You need to log in</h2>
        <p className="text-gray-600">
          Please sign in to view and manage your reviews.
        </p>
      </div>
    );
  }

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
            <ReviewCard
              key={review.review_id}
              review={review}
              deleteReview={deleteReview}
              deleteLoading={deleteLoading}
            />
          ))}
        </div>
      )}
    </div>
  );
}
