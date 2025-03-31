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
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/reviews`,
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
  if (!user) {
    return (
      <div className="container mx-auto py-8 px-4 mt-4 text-center">
        <h2 className="text-2xl font-bold mb-4">
          You need to be logged in to leave a review
        </h2>
      </div>
    );
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
