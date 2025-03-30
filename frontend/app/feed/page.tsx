"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import ReviewCard from "../components/review-card"; // Import ReviewCard

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

export default function Feed() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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
            <ReviewCard
              key={review.review_id}
              review={review}
              deleteReview={() => {}} // Placeholder for deleteReview function
              deleteLoading={null} // Placeholder for deleteLoading state
            />
          ))}
        </div>
      )}
    </div>
  );
}
