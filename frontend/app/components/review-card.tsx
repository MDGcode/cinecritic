"use client";
import { useEffect, useState } from "react";
import { Trash, Send } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { UserAuth } from "../context/AuthContext";
import { usePathname } from "next/navigation";
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

interface Comment {
  comment_id: number;
  user_id: string;
  review_id: number;
  comment: string;
  displayname: string;
  photoUrl: string;
}

interface ReviewCardProps {
  review: Review;
  deleteReview: (reviewId: number) => void;
  deleteLoading: number | null;
}

export default function ReviewCard({
  review,
  deleteReview,
  deleteLoading,
}: ReviewCardProps) {
  const [posterUrl, setPosterUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [postingComment, setPostingComment] = useState<boolean>(false);
  const { user } = UserAuth();
  const pathname = usePathname();
  useEffect(() => {
    async function fetchMoviePoster() {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${review.movie_id}?language=en-US`,
          {
            method: "GET",
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_KEY}`,
            },
          }
        );

        const movie = await response.json();
        setPosterUrl(
          movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : "/placeholder.svg"
        );
      } catch (error) {
        console.error("Error fetching movie poster:", error);
        setPosterUrl("/placeholder.svg");
      } finally {
        setLoading(false);
      }
    }

    fetchMoviePoster();
  }, [review.movie_id]);

  useEffect(() => {
    async function fetchComments() {
      try {
        const response = await fetch(
          `https://4b73e3ed-b20c-40d1-9a6b-bf6be4287be5.eu-central-1.cloud.genez.io/api/comments/review/${review.review_id}`
        );
        const data: Comment[] = await response.json();
        setComments(data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    }

    fetchComments();
  }, [review.review_id]);

  async function handleAddComment() {
    if (!newComment.trim()) return;

    setPostingComment(true);
    try {
      const response = await fetch(
        "https://4b73e3ed-b20c-40d1-9a6b-bf6be4287be5.eu-central-1.cloud.genez.io/api/comments",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: user?.uid,
            review_id: review.review_id,
            comment: newComment,
            displayname: user?.displayName,
            photoUrl: user?.photoURL,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to post comment");

      const newCommentData: Comment = await response.json();
      setComments((prev) => [...prev, newCommentData]); // Append new comment
      setNewComment(""); // Clear input
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setPostingComment(false);
    }
  }

  return (
    <div className="border p-4 rounded-lg shadow-md">
      <div className="flex items-start gap-6">
        {/* Left side: Movie poster */}
        <div className="flex-shrink-0">
          {loading ? (
            <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
          ) : (
            <Image
              src={posterUrl || "/placeholder.svg"}
              alt={review.title}
              width={100}
              height={150}
              className="object-cover rounded-md"
            />
          )}
        </div>

        {/* Right side: Review content */}
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-4">
            {/* Display user's photo and name */}
            <div className="flex-shrink-0 mr-4">
              <Image
                src={review.photoUrl || "/placeholder-profile.png"}
                alt={review.displayname || "User"}
                width={40}
                height={40}
                className="rounded-full"
              />
            </div>
            <div>
              <p className="font-semibold">
                {review.displayname || "Anonymous"}
              </p>
            </div>
            {/* Delete Icon with Spinner */}
            {pathname === "/myreviews" && (
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
            )}
          </div>
          <h3 className="text-xl font-semibold mb-2">{review.title}</h3>
          <p className="mb-4">{review.content}</p>
          <div className="flex items-center mb-4">
            <span className="ml-4 text-yellow-500">{review.rating} / 10</span>
          </div>
          <Link
            href={`/movie/${review.movie_id}`}
            className="text-blue-600 hover:underline mt-4 block text-center"
          >
            View Movie Details
          </Link>

          {/* Comments Section */}
          <div className="mt-6">
            <h4 className="text-lg font-semibold">Comments</h4>
            {comments.length > 0 ? (
              <div className="mt-2 space-y-2">
                {comments.map((comment) => (
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
            ) : (
              <p className="text-gray-500 mt-2">No comments yet.</p>
            )}

            {/* Add Comment Form */}
            <div className="mt-4 flex items-center gap-2">
              <input
                type="text"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 p-2 border rounded-md"
              />
              <button
                onClick={handleAddComment}
                className="bg-blue-500 text-white px-3 py-1 rounded-md"
                disabled={postingComment}
              >
                {postingComment ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  <Send size={20} />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
