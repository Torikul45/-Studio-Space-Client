
"use client";

import { useState } from "react";
import { toast } from "sonner";

type ReviewFormProps = {
  studioId: string;
  userName: string;
  userEmail: string;
};

async function getAuthToken() {
  const response = await fetch("/api/auth/token", {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  const data = await response.json();

  if (!response.ok || !data.token) {
    throw new Error("Authentication token পাওয়া যায়নি। আবার login করো।");
  }

  return data.token as string;
}

export default function ReviewForm({
  studioId,
}: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Please select a star rating.");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please write your review.");
      return;
    }

    if (comment.trim().length > 1000) {
      toast.error("Review must be within 1000 characters.");
      return;
    }

    try {
      setLoading(true);

      const token = await getAuthToken();

      const response = await fetch(
        `http://localhost:5000/studios/${studioId}/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            rating,
            comment: comment.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit review.");
      }

      toast.success("Your review has been submitted successfully!");

      setRating(0);
      setComment("");

      // Review list এবং rating refresh করবে
      window.location.reload();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border p-5">
      <div>
        <h3 className="text-xl font-semibold">Write a Review</h3>
        <p className="mt-1 text-sm text-gray-500">
          Share your experience with this studio.
        </p>
      </div>

      <div>
        <p className="mb-2 font-medium">Your Rating</p>

        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              disabled={loading}
              className={`text-3xl ${
                star <= rating ? "text-yellow-400" : "text-gray-300"
              }`}
              aria-label={`Rate ${star} out of 5`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="review" className="mb-2 block font-medium">
          Your Review
        </label>

        <textarea
          id="review"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your experience..."
          rows={4}
          maxLength={1000}
          disabled={loading}
          className="w-full rounded-lg border p-3 outline-none focus:border-green-600"
        />
        <p className="mt-1 text-right text-xs text-gray-500">
          {comment.length}/1000
        </p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-green-600 px-6 py-3 font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}
