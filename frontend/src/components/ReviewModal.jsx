import { useEffect, useState } from "react";
import { Star, X, CheckCircle2, AlertCircle } from "lucide-react";
import API from "../services/api";

function ReviewModal({ open, booking, onClose, onSuccess }) {
    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        if (!open) return;

        const onKeyDown = (event) => {
            if (event.key === "Escape" && !loading) {
                onClose?.();
            }
        };

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [open, loading, onClose]);

    if (!open || !booking) return null;

    const handleClose = () => {
        setRating(5);
        setHoverRating(0);
        setComment("");
        setError("");
        setSuccess("");
        onClose?.();
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setSuccess("");

        if (!rating || rating < 1 || rating > 5) {
            setError("Please select a rating between 1 and 5 stars.");
            return;
        }

        try {
            setLoading(true);
            await API.post("/reviews", {
                bookingId: booking._id,
                rating,
                comment: comment.trim() || undefined,
            });

            setSuccess("Thank you! Your review has been submitted.");
            setTimeout(() => {
                onSuccess?.();
                handleClose();
            }, 900);
        } catch (err) {
            setError(err.response?.data?.message || "Unable to submit review");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-end justify-center bg-ink/60 dark:bg-black/70 p-4 sm:items-center backdrop-blur-xs"
            role="dialog"
            aria-modal="true"
            aria-labelledby="review-modal-title"
        >
            <button
                type="button"
                className="absolute inset-0 cursor-default"
                aria-label="Close dialog"
                onClick={loading ? undefined : handleClose}
            />

            <div className="relative w-full max-w-lg rounded-3xl border border-line dark:border-line bg-white dark:bg-[#11131a] p-6 shadow-2xl sm:p-8 animate-fade-up">
                <button
                    type="button"
                    onClick={handleClose}
                    disabled={loading}
                    className="absolute right-5 top-5 rounded-full p-1.5 text-muted dark:text-zinc-400 hover:bg-canvas dark:hover:bg-white/5 hover:text-ink dark:hover:text-white transition-colors cursor-pointer"
                    aria-label="Close modal"
                >
                    <X size={18} />
                </button>

                <div className="space-y-1">
                    <h2 id="review-modal-title" className="font-display text-2xl font-bold text-ink dark:text-white">
                        Review this service
                    </h2>
                    <p className="text-xs font-semibold text-muted dark:text-zinc-400">
                        {booking.service?.title || "Completed Service Order"}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                    {error && (
                        <div className="rounded-xl border border-rose-100 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/30 p-3 text-xs font-semibold text-rose-700 dark:text-rose-400 flex gap-2 items-center">
                            <AlertCircle size={15} className="shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {success && (
                        <div className="rounded-xl border border-emerald-100 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-950/30 p-3 text-xs font-semibold text-emerald-800 dark:text-emerald-400 flex gap-2 items-center">
                            <CheckCircle2 size={15} className="shrink-0" />
                            <span>{success}</span>
                        </div>
                    )}

                    {/* Star Rating Picker */}
                    <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-ink dark:text-zinc-200 block mb-2">
                            Your Rating
                        </label>
                        <div className="flex items-center gap-1.5">
                            {[1, 2, 3, 4, 5].map((star) => {
                                const active = (hoverRating || rating) >= star;
                                return (
                                    <button
                                        key={star}
                                        type="button"
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        onClick={() => setRating(star)}
                                        className="p-1 text-muted dark:text-zinc-400 transition-transform hover:scale-110 cursor-pointer focus:outline-none"
                                        aria-label={`${star} star rating`}
                                    >
                                        <Star
                                            size={28}
                                            className={`${
                                                active
                                                    ? "fill-amber-400 text-amber-400"
                                                    : "text-stone-300 dark:text-zinc-700"
                                            } transition-colors duration-150`}
                                        />
                                    </button>
                                );
                            })}
                            <span className="ml-2 text-sm font-bold text-ink dark:text-white">
                                {rating} of 5 stars
                            </span>
                        </div>
                    </div>

                    {/* Feedback comment */}
                    <div>
                        <label
                            htmlFor="review-comment"
                            className="text-xs font-bold uppercase tracking-wider text-ink dark:text-zinc-200 block mb-2"
                        >
                            Feedback & Comments (Optional)
                        </label>
                        <textarea
                            id="review-comment"
                            rows={4}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="How was your experience? Was the communication clear and delivery timely?"
                            maxLength={1000}
                            className="w-full resize-none rounded-xl border border-line dark:border-line bg-canvas/30 dark:bg-white/5 px-4 py-3 text-sm text-ink dark:text-white outline-none focus:ring-4 focus:ring-accent/10 focus:border-accent focus:bg-white dark:focus:bg-[#161922] transition-all duration-200 placeholder:text-muted/50 dark:placeholder:text-zinc-500 font-medium"
                        />
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 pt-2">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={loading}
                            className="rounded-xl border border-line dark:border-line px-4 py-2.5 text-xs font-bold text-ink dark:text-zinc-300 hover:bg-canvas dark:hover:bg-white/5 disabled:opacity-50 cursor-pointer transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-xl bg-ink dark:bg-teal-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-zinc-800 dark:hover:bg-teal-700 shadow-md active:scale-98 disabled:opacity-50 cursor-pointer transition-all"
                        >
                            {loading ? "Submitting..." : "Submit Review"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ReviewModal;
