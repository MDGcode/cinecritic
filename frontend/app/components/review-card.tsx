"use client";
import { useEffect, useState } from "react";
import {
  Trash,
  Send,
  Star,
  MessageCircle,
  ExternalLink,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
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
  const [movieTitle, setMovieTitle] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [postingComment, setPostingComment] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const { user } = UserAuth();
  const pathname = usePathname();

  useEffect(() => {
    async function fetchMovieDetails() {
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
        setMovieTitle(movie.title || "Unknown Movie");
      } catch (error) {
        console.error("Error fetching movie details:", error);
        setPosterUrl("/placeholder.svg");
        setMovieTitle("Unknown Movie");
      } finally {
        setLoading(false);
      }
    }

    fetchMovieDetails();
  }, [review.movie_id]);

  useEffect(() => {
    async function fetchComments() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/api/comments/review/${review.review_id}`
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
    if (!newComment.trim() || !user) return;

    setPostingComment(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/comments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: user.uid,
            review_id: review.review_id,
            comment: newComment,
            displayname: user.displayName,
            photoUrl: user.photoURL,
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

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow bg-white overflow-hidden">
      {/* Review Header */}
      <div className="bg-gradient-to-r from-blue-50 to-white p-4 border-b border-gray-100">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 rounded-full overflow-hidden border-2 border-white shadow-sm">
              <Image
                src={review.photoUrl || "/placeholder-profile.png"}
                alt={review.displayname || "User"}
                fill
                className="object-cover"
                sizes="48px"
              />
            </div>
            <div>
              <p className="font-semibold text-gray-800">
                {review.displayname || "Anonymous"}
              </p>
              <div className="flex items-center mt-1">
                <div className="flex items-center bg-blue-600 text-white px-2 py-0.5 rounded-md text-sm">
                  <Star className="h-3.5 w-3.5 mr-1 fill-yellow-300 text-yellow-300" />
                  <span className="font-medium">{review.rating}</span>
                  <span className="text-xs text-blue-100 ml-0.5">/10</span>
                </div>
              </div>
            </div>
          </div>

          {/* Delete Button */}
          {pathname === "/myreviews" && (
            <button
              onClick={() => deleteReview(review.review_id)}
              className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-full hover:bg-red-50"
              disabled={deleteLoading === review.review_id}
              aria-label="Delete review"
            >
              {deleteLoading === review.review_id ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                <Trash size={18} />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Review Content */}
      <div className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Movie Poster */}
          <div className="sm:w-[120px] flex-shrink-0 mx-auto sm:mx-0">
            {loading ? (
              <div className="w-[100px] h-[150px] sm:w-[120px] sm:h-[180px] bg-gray-100 rounded-lg flex items-center justify-center">
                <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
              </div>
            ) : (
              <div className="relative w-[100px] h-[150px] sm:w-[120px] sm:h-[180px] mx-auto sm:mx-0 rounded-lg overflow-hidden shadow-md border border-gray-200">
                <Image
                  src={posterUrl || "/placeholder.svg"}
                  alt={movieTitle}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100px, 120px"
                />
              </div>
            )}

            <Link
              href={`/movie/${review.movie_id}`}
              className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center justify-center sm:justify-start gap-1"
            >
              <ExternalLink size={14} />
              <span>View Movie</span>
            </Link>
          </div>

          {/* Review Text */}
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              {review.title}
            </h3>
            <p
              className={`text-gray-600 leading-relaxed ${
                !isExpanded && review.content.length > 200 ? "line-clamp-3" : ""
              }`}
            >
              {review.content}
            </p>

            {review.content.length > 200 && (
              <button
                onClick={toggleExpand}
                className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium focus:outline-none"
              >
                {isExpanded ? "Show less" : "Read more"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-gray-50 p-4 border-t border-gray-100">
        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
          <MessageCircle className="h-4 w-4 mr-1 text-blue-500" />
          Comments ({comments.length})
        </h4>

        {comments.length > 0 ? (
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 mb-4">
            {comments.map((comment) => (
              <div key={comment.comment_id} className="flex items-start gap-3">
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
                  <p className="text-sm text-gray-600 mt-1 break-words">
                    {comment.comment}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm italic mb-4">
            No comments yet. Be the first to comment!
          </p>
        )}

        {/* Add Comment Form */}
        <div className="flex items-center gap-2 mt-3">
          <input
            type="text"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1 p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={postingComment || !user}
          />
          <button
            onClick={handleAddComment}
            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg flex-shrink-0 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={postingComment || !newComment.trim() || !user}
            aria-label="Send comment"
          >
            {postingComment ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              <Send size={18} />
            )}
          </button>
        </div>
        {!user && (
          <p className="text-xs text-gray-500 mt-1">
            You need to be logged in to comment.
          </p>
        )}
      </div>
    </div>
  );
}
