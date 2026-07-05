"use client";

import { FormEvent, useEffect, useState } from "react";
import { Loader2, Send, Star } from "lucide-react";
import { toast } from "sonner";

type Review = {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  profiles?: {
    full_name: string | null;
  } | null;
};

export function ReviewSection({ productId, initialReviews = [] }: { productId: string; initialReviews?: Review[] }) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/comments?productId=${productId}`)
      .then((response) => response.json())
      .then((payload) => setReviews(payload.reviews ?? initialReviews))
      .catch(() => undefined);
  }, [initialReviews, productId]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const form = new FormData(event.currentTarget);

    const response = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId,
        rating: Number(form.get("rating") ?? 5),
        comment: String(form.get("comment") ?? "")
      })
    });

    const payload = await response.json();
    setLoading(false);

    if (!response.ok) {
      toast.error(payload.error ?? "Review could not be saved");
      return;
    }

    setReviews((current) => [payload.review, ...current]);
    event.currentTarget.reset();
    toast.success("Review posted");
  }

  const average = reviews.length ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0;

  return (
    <section className="section-y">
      <div className="container-px">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="eyebrow">Reviews</p>
            <h2 className="mt-3 text-3xl font-black">Customer comments</h2>
            <p className="mt-3 text-forge-steel">{reviews.length ? `${average.toFixed(1)} average rating from ${reviews.length} reviews.` : "Be the first to review this product."}</p>
            <form onSubmit={handleSubmit} className="surface mt-6 rounded-md p-5">
              <label className="grid gap-2">
                <span className="label">Rating</span>
                <select name="rating" className="field" defaultValue="5">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <option key={rating} value={rating}>{rating}</option>
                  ))}
                </select>
              </label>
              <label className="mt-4 grid gap-2">
                <span className="label">Comment</span>
                <textarea name="comment" required rows={4} className="field" />
              </label>
              <button disabled={loading} className="btn-primary mt-4">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Post review
              </button>
            </form>
          </div>
          <div className="grid gap-4">
            {reviews.map((review) => (
              <article key={review.id} className="rounded-md border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-white/[0.06]">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold">{review.profiles?.full_name ?? "Verified customer"}</p>
                  <span className="inline-flex items-center gap-1 text-sm text-forge-amber">
                    <Star className="h-4 w-4 fill-forge-amber" />
                    {review.rating}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-forge-steel">{review.comment}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
