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
      setComments((prev) => [...prev, newCommentData]);
      setNewComment("");
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setPostingComment(false);
    }
  }

  return (
    <div className="border p-3 sm:p-4 rounded-lg shadow-md bg-white">
      <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
        {/* Movie poster - centered on mobile, left-aligned on larger screens */}
        <div className="w-full sm:w-auto flex justify-center sm:justify-start sm:flex-shrink-0 mb-4 sm:mb-0">
          {loading ? (
            <div className="w-[100px] h-[150px] flex items-center justify-center">
              <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
            </div>
          ) : (
            <Image
              src={posterUrl || "/placeholder.svg"}
              alt={review.title}
              width={100}
              height={150}
              className="object-cover rounded-md shadow-sm"
            />
          )}
        </div>

        {/* Review content */}
        <div className="flex-1 w-full">
          {/* User info and delete button */}
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <div className="flex-shrink-0">
              <Image
                src={review.photoUrl || "/placeholder-profile.png"}
                alt={review.displayname || "User"}
                width={36}
                height={36}
                className="rounded-full"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">
                {review.displayname || "Anonymous"}
              </p>
            </div>
            {/* Delete Icon with Spinner */}
            {pathname === "/myreviews" && (
              <button
                onClick={() => deleteReview(review.review_id)}
                className="text-red-500 cursor-pointer"
                disabled={deleteLoading === review.review_id}
                aria-label="Delete review"
              >
                {deleteLoading === review.review_id ? (
                  <Loader2 className="animate-spin h-5 w-5 text-red-500" />
                ) : (
                  <Trash size={18} />
                )}
              </button>
            )}
          </div>

          {/* Review title and content */}
          <h3 className="text-lg sm:text-xl font-semibold mb-2">
            {review.title}
          </h3>
          <p className="mb-3 text-sm sm:text-base">{review.content}</p>

          {/* Rating */}
          <div className="flex items-center mb-3">
            <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-md text-sm font-medium">
              Rating: {review.rating}/10
            </div>
          </div>

          {/* Movie details link */}
          <Link
            href={`/movie/${review.movie_id}`}
            className="text-blue-600 hover:underline text-sm inline-block mb-4"
          >
            View Movie Details
          </Link>

          {/* Comments Section */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="text-md sm:text-lg font-semibold mb-2">Comments</h4>

            {comments.length > 0 ? (
              <div className="mt-2 space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {comments.map((comment) => (
                  <div
                    key={comment.comment_id}
                    className="flex items-start gap-2"
                  >
                    <Image
                      src={comment.photoUrl || "/placeholder-profile.png"}
                      alt={comment.displayname || "User"}
                      width={28}
                      height={28}
                      className="rounded-full mt-1"
                    />
                    <div className="bg-gray-50 p-2 rounded-lg flex-1">
                      <p className="font-semibold text-sm">
                        {comment.displayname}
                      </p>
                      <p className="text-sm break-words">{comment.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm mt-2">No comments yet.</p>
            )}

            {/* Add Comment Form */}
            <div className="mt-3 flex items-center gap-2">
              <input
                type="text"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 p-2 text-sm border rounded-md"
              />
              <button
                onClick={handleAddComment}
                className="bg-blue-500 text-white p-2 rounded-md flex-shrink-0"
                disabled={postingComment}
                aria-label="Send comment"
              >
                {postingComment ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  <Send size={18} />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
