import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    CheckCircle2,
    Clock,
    Tag,
    User,
    Mail,
    AlertCircle,
    CalendarCheck,
    Code2,
    Palette,
    Megaphone,
    PenTool,
    Star,
    MessageSquare,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import Loading from "../components/Loading";
import { formatDate, formatPrice } from "../utils/constants";

const CATEGORY_THEMES = {
    Development: {
        gradient: "from-teal-950 to-teal-800",
        icon: Code2,
        accent: "text-teal-300 bg-teal-950/50 border-teal-800/40",
    },
    Design: {
        gradient: "from-fuchsia-950 to-pink-800",
        icon: Palette,
        accent: "text-pink-300 bg-pink-950/50 border-pink-800/40",
    },
    Marketing: {
        gradient: "from-amber-950 to-amber-800",
        icon: Megaphone,
        accent: "text-amber-300 bg-amber-950/50 border-amber-800/40",
    },
    Writing: {
        gradient: "from-indigo-950 to-indigo-800",
        icon: PenTool,
        accent: "text-indigo-300 bg-indigo-950/50 border-indigo-800/40",
    },
};

function ServiceDetails() {
    const { id } = useParams();
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    const [service, setService] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [booking, setBooking] = useState(false);
    const [message, setMessage] = useState("");
    const [feedback, setFeedback] = useState("");

    useEffect(() => {
        const fetchServiceAndReviews = async () => {
            try {
                setLoading(true);
                setError("");

                const [serviceRes, reviewsRes] = await Promise.allSettled([
                    API.get(`/services/${id}`),
                    API.get(`/reviews/service/${id}`),
                ]);

                if (serviceRes.status === "fulfilled") {
                    setService(serviceRes.value.data.service);
                } else {
                    throw serviceRes.reason;
                }

                if (reviewsRes.status === "fulfilled") {
                    setReviews(reviewsRes.value.data.reviews || []);
                }
            } catch (err) {
                setError(err.response?.data?.message || "Unable to load service details");
            } finally {
                setLoading(false);
            }
        };

        fetchServiceAndReviews();
    }, [id]);

    const handleBooking = async () => {
        if (!isAuthenticated) {
            navigate("/login");
            return;
        }

        if (user?.role !== "customer") {
            setFeedback("Only customers can book services.");
            return;
        }

        try {
            setBooking(true);
            setFeedback("");
            await API.post("/bookings", {
                serviceId: service._id,
                message: message.trim() || undefined,
            });
            navigate("/dashboard");
        } catch (err) {
            setFeedback(err.response?.data?.message || "Unable to create booking");
        } finally {
            setBooking(false);
        }
    };

    if (loading) {
        return <Loading label="Loading service details..." />;
    }

    if (error || !service) {
        return (
            <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/40">
                    <AlertCircle size={24} />
                </div>
                <h2 className="mt-5 font-display text-3xl font-bold text-ink dark:text-white">Service not found</h2>
                <p className="mt-2 text-sm text-muted dark:text-zinc-400">{error || "This service may have been removed."}</p>
                <Link
                    to="/services"
                    className="mt-6 inline-flex rounded-xl bg-ink dark:bg-teal-600 px-5 py-3 text-sm font-bold text-white hover:bg-zinc-800 dark:hover:bg-teal-700 transition-all duration-150 active:scale-98"
                >
                    Back to services
                </Link>
            </div>
        );
    }

    const category = service.category || "Development";
    const theme = CATEGORY_THEMES[category] || CATEGORY_THEMES.Development;
    const IconComponent = theme.icon;

    const avgRating = reviews.length
        ? (reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / reviews.length).toFixed(1)
        : null;

    return (
        <div className="bg-canvas/15 dark:bg-transparent min-h-screen py-8">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
                {/* Breadcrumbs / Back button */}
                <div className="flex items-center justify-between text-xs font-semibold text-muted dark:text-zinc-400">
                    <Link
                        to="/services"
                        className="inline-flex items-center gap-2 hover:text-ink dark:hover:text-white transition-colors"
                    >
                        <ArrowLeft size={14} className="stroke-[2.5]" />
                        Back to services
                    </Link>
                    <div className="hidden sm:flex items-center gap-2">
                        <Link to="/" className="hover:text-ink dark:hover:text-white">Home</Link>
                        <span>/</span>
                        <Link to="/services" className="hover:text-ink dark:hover:text-white">Services</Link>
                        <span>/</span>
                        <span className="text-ink dark:text-white font-bold max-w-[200px] truncate">{service.title}</span>
                    </div>
                </div>

                <div className="mt-6 grid gap-8 lg:grid-cols-3">
                    {/* Left Column: Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Hero Category Banner */}
                        <div className={`relative h-60 w-full overflow-hidden rounded-3xl bg-gradient-to-br ${theme.gradient} flex items-center justify-center sm:h-72 shadow-inner`}>
                            {/* Abstract visual grids */}
                            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px]" />
                            <div className="absolute -right-10 -bottom-10 text-white/5">
                                <IconComponent size={240} className="stroke-[1.5]" />
                            </div>
                            <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-lg">
                                <IconComponent size={36} className="stroke-[2.2]" />
                            </div>
                        </div>

                        {/* Title & Metadata Card */}
                        <div className="rounded-2xl border border-line/60 dark:border-line bg-white dark:bg-[#11131a] p-6 sm:p-8 shadow-sm">
                            <div className="flex flex-wrap items-center gap-3">
                                <span className={`rounded-full border px-3.5 py-0.5 text-xs font-bold ${theme.accent}`}>
                                    {category}
                                </span>
                                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-muted dark:text-zinc-400 bg-canvas dark:bg-white/5 px-2.5 py-0.5 rounded-full border border-line/50 dark:border-line">
                                    <Clock size={13} className="text-muted/80 dark:text-zinc-400" />
                                    {service.duration}
                                </span>
                                {avgRating && (
                                    <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-900/40">
                                        <Star size={12} className="fill-amber-400 text-amber-400" />
                                        {avgRating} ({reviews.length} review{reviews.length > 1 ? "s" : ""})
                                    </span>
                                )}
                            </div>

                            <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-ink dark:text-white sm:text-4xl leading-tight">
                                {service.title}
                            </h1>

                            <h3 className="mt-6 text-xs font-bold uppercase tracking-wider text-ink dark:text-zinc-200">Service Description</h3>
                            <p className="mt-3 text-sm leading-relaxed text-muted dark:text-zinc-300 whitespace-pre-wrap">
                                {service.description}
                            </p>
                        </div>

                        {/* About Provider Card */}
                        <div className="rounded-2xl border border-line/60 dark:border-line bg-white dark:bg-[#11131a] p-6 sm:p-8 shadow-sm">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-ink dark:text-zinc-200">About the provider</h3>
                            <div className="mt-5 flex flex-col sm:flex-row sm:items-center gap-4.5">
                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-canvas dark:bg-white/5 border border-line dark:border-line text-muted dark:text-zinc-400 shadow-sm">
                                    <User size={26} className="stroke-[2]" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="font-display text-lg font-bold text-ink dark:text-white leading-tight">
                                        {service.provider?.name || "SkillBook Provider"}
                                    </h4>
                                    <p className="text-sm font-medium text-muted dark:text-zinc-400 flex items-center gap-1.5">
                                        <Mail size={14} className="text-muted/70 dark:text-zinc-400" />
                                        {service.provider?.email}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Customer Reviews Section */}
                        <div className="rounded-2xl border border-line/60 dark:border-line bg-white dark:bg-[#11131a] p-6 sm:p-8 shadow-sm space-y-6">
                            <div className="flex items-center justify-between border-b border-line/50 dark:border-line pb-4">
                                <div className="space-y-1">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-ink dark:text-zinc-200">
                                        Client Reviews & Ratings
                                    </h3>
                                    <p className="text-xs text-muted dark:text-zinc-400">
                                        Authentic feedback from customers who booked this service.
                                    </p>
                                </div>
                                {avgRating ? (
                                    <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/40 px-3 py-1.5 rounded-xl">
                                        <Star size={16} className="fill-amber-400 text-amber-400" />
                                        <span className="font-display font-bold text-sm text-amber-900 dark:text-amber-200">
                                            {avgRating} / 5
                                        </span>
                                        <span className="text-xs text-amber-700 dark:text-amber-400 font-medium">
                                            ({reviews.length})
                                        </span>
                                    </div>
                                ) : (
                                    <span className="text-xs font-semibold text-muted dark:text-zinc-400 bg-canvas dark:bg-white/5 px-2.5 py-1 rounded-lg border border-line/50 dark:border-line">
                                        No reviews yet
                                    </span>
                                )}
                            </div>

                            {reviews.length === 0 ? (
                                <div className="text-center py-8 text-muted dark:text-zinc-400 space-y-2">
                                    <MessageSquare size={24} className="mx-auto text-muted/50 dark:text-zinc-500" />
                                    <p className="text-sm font-medium">No reviews written yet.</p>
                                    <p className="text-xs text-muted/75 dark:text-zinc-500 max-w-sm mx-auto">
                                        Complete a booking order with this provider to be the first to leave feedback!
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {reviews.map((rev) => (
                                        <div
                                            key={rev._id}
                                            className="rounded-xl border border-line/50 dark:border-line bg-canvas/30 dark:bg-white/5 p-4.5 space-y-2.5 transition-all hover:bg-canvas/50 dark:hover:bg-white/10"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-ink dark:bg-teal-600 text-[11px] font-bold text-white">
                                                        {rev.customer?.name?.[0] || "C"}
                                                    </div>
                                                    <span className="text-xs font-bold text-ink dark:text-zinc-100">
                                                        {rev.customer?.name || "Verified Customer"}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    {[1, 2, 3, 4, 5].map((s) => (
                                                        <Star
                                                            key={s}
                                                            size={13}
                                                            className={
                                                                s <= (rev.rating || 5)
                                                                    ? "fill-amber-400 text-amber-400"
                                                                    : "text-stone-300 dark:text-stone-700"
                                                            }
                                                        />
                                                    ))}
                                                    <span className="ml-2 text-[10px] font-semibold text-muted dark:text-zinc-400">
                                                        {formatDate(rev.createdAt)}
                                                    </span>
                                                </div>
                                            </div>
                                            {rev.comment && (
                                                <p className="text-xs leading-relaxed text-muted dark:text-zinc-300 pl-9">
                                                    "{rev.comment}"
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Sidebar Sticky Booking Checkout */}
                    <aside>
                        <div className="rounded-2xl border border-line/70 dark:border-line bg-white dark:bg-[#11131a] p-6 shadow-md lg:sticky lg:top-24 space-y-6">
                            <div>
                                <span className="text-xs font-bold uppercase tracking-wider text-muted dark:text-zinc-400">Fixed price package</span>
                                <div className="mt-1 flex items-baseline justify-between">
                                    <span className="font-display text-4xl font-extrabold text-accent dark:text-teal-400">
                                        {formatPrice(service.price)}
                                    </span>
                                </div>
                            </div>

                            <div className="border-t border-line/50 dark:border-line pt-5">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-ink dark:text-zinc-200">What's included</h4>
                                <ul className="mt-3.5 space-y-3 text-sm font-medium text-muted dark:text-zinc-300">
                                    <li className="flex items-center gap-3">
                                        <CheckCircle2 size={16} className="text-accent dark:text-teal-400 shrink-0 stroke-[2.5]" />
                                        <span>Professional quality delivery</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <Clock size={16} className="text-muted/75 dark:text-zinc-400 shrink-0" />
                                        <span>Estimated delivery: {service.duration}</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <Tag size={16} className="text-muted/75 dark:text-zinc-400 shrink-0" />
                                        <span>Category: {category}</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Optional Booking message */}
                            <div className="border-t border-line/50 dark:border-line pt-5 space-y-2">
                                <label htmlFor="booking-message" className="text-xs font-bold uppercase tracking-wider text-ink dark:text-zinc-200">
                                    Note to provider (optional)
                                </label>
                                <textarea
                                    id="booking-message"
                                    value={message}
                                    onChange={(event) => setMessage(event.target.value)}
                                    rows={3}
                                    className="w-full resize-none rounded-xl border border-line dark:border-line bg-canvas/30 dark:bg-white/5 px-3 py-2.5 text-sm text-ink dark:text-white outline-none focus:ring-4 focus:ring-accent/10 focus:border-accent focus:bg-white dark:focus:bg-[#161922] transition-all duration-200 placeholder:text-muted/60 dark:placeholder:text-zinc-500"
                                    placeholder="State project scope, requirements, or timeline requests..."
                                />
                            </div>

                            {feedback && (
                                <div className="rounded-xl border border-rose-100 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/30 p-3 text-xs font-semibold text-rose-700 dark:text-rose-400 flex gap-2 items-center">
                                    <AlertCircle size={15} className="shrink-0" />
                                    <span>{feedback}</span>
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={handleBooking}
                                disabled={booking}
                                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-ink dark:bg-teal-600 py-3.5 text-sm font-bold text-white hover:bg-zinc-800 dark:hover:bg-teal-700 shadow-md transition-all duration-200 active:scale-98 disabled:opacity-50 cursor-pointer"
                            >
                                <CalendarCheck size={16} className="stroke-[2.5]" />
                                {booking ? "Submitting request..." : "Book this service"}
                            </button>

                            <p className="text-center text-[11px] font-semibold text-muted dark:text-zinc-400 leading-relaxed">
                                {isAuthenticated
                                    ? "By requesting, you create a booking order that the provider can review and accept."
                                    : "You must be signed in as a customer to submit a booking."}
                            </p>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}

export default ServiceDetails;
