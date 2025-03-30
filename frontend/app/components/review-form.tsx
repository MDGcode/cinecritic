"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserAuth } from "@/app/context/AuthContext";
import { Loader2 } from "lucide-react";

interface ReviewFormProps {
  movieId: number;
}

export default function ReviewForm({ movieId }: ReviewFormProps) {
  const { user } = UserAuth();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!user) return alert("You must be logged in to leave a review.");

    const numericRating = Number(rating);
    if (isNaN(numericRating) || numericRating < 0 || numericRating > 10) {
      return alert("Rating must be a number between 0 and 10.");
    }

    setLoading(true);
    setSuccess(false);
    setError("");

    try {
      const response = await fetch(
        "https://4b73e3ed-b20c-40d1-9a6b-bf6be4287be5.eu-central-1.cloud.genez.io/api/reviews",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            movie_id: movieId,
            user_id: user.uid,
            rating: numericRating,
            title,
            content,
            displayname: user.displayName,
            photoUrl: user.photoURL,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to submit review");

      setTitle("");
      setContent("");
      setRating("");
      setSuccess(true);
      router.refresh();
    } catch (error) {
      console.error("Error submitting review:", error);
      setError("Failed to submit review. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 p-4 border rounded-lg shadow-md"
    >
      <h2 className="text-xl font-semibold mb-4">Leave a Review</h2>
      {success && (
        <p className="text-green-600 mb-3">Review submitted successfully!</p>
      )}
      {error && <p className="text-red-600 mb-3">{error}</p>}
      <div className="mb-3">
        <label className="block text-sm font-medium">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded mt-1"
          required
        />
      </div>
      <div className="mb-3">
        <label className="block text-sm font-medium">Review</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 border rounded mt-1"
          required
        />
      </div>
      <div className="mb-3">
        <label className="block text-sm font-medium">Rating (0-10)</label>
        <input
          type="text"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="w-full p-2 border rounded mt-1"
          required
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded mt-2 flex items-center"
        disabled={loading}
      >
        {loading ? (
          <Loader2 className="animate-spin h-5 w-5 mr-2" />
        ) : (
          "Submit Review"
        )}
      </button>
    </form>
  );
}
