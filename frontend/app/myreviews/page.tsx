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
