"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

type ReviewRow = {
  id: string;
  rating: number;
  comment: string;
  products?: { name?: string | null } | null;
  profiles?: { full_name?: string | null } | null;
};

export function AdminReviewManager({ initialReviews }: { initialReviews: ReviewRow[] }) {
  const [reviews, setReviews] = useState(initialReviews);

  async function deleteReview(id: string) {
    const response = await fetch(`/api/comments/${id}`, { method: "DELETE" });
    const result = await response.json();

    if (!response.ok) {
      toast.error(result.error ?? "Review delete failed");
      return;
    }

    setReviews((current) => current.filter((review) => review.id !== id));
    toast.success("Review deleted");
  }

  return (
    <div className="grid gap-3">
      {reviews.map((review) => (
        <div key={review.id} className="flex flex-wrap items-start justify-between gap-3 rounded-md border border-black/10 p-3 text-sm dark:border-white/10">
          <div>
            <p className="font-semibold">{review.rating}/5 · {review.products?.name ?? "Product"}</p>
            <p className="text-forge-steel">{review.profiles?.full_name ?? "Customer"} · {review.comment}</p>
          </div>
          <button type="button" className="grid h-9 w-9 place-items-center rounded-md border border-black/10 text-forge-coral hover:border-forge-coral dark:border-white/10" onClick={() => deleteReview(review.id)} aria-label="Delete review">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
