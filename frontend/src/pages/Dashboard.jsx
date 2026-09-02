import { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import {
    CalendarDays,
    CheckCircle,
    Clock,
    Inbox,
    Sparkles,
    Plus,
    Star,
    CheckCircle2,
} from "lucide-react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";
import BookingCard from "../components/BookingCard";
import StatCard from "../components/StatCard";
import ReviewModal from "../components/ReviewModal";
import ChatModal from "../components/ChatModal";
import { dashboardPath } from "../utils/constants";

function Dashboard() {
    const { user, ready } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [reviewBooking, setReviewBooking] = useState(null);
    const [chatBooking, setChatBooking] = useState(null);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const response = await API.get("/bookings/my-bookings");
            setBookings(response.data.bookings || []);
        } catch (err) {
            setError(err.response?.data?.message || "Unable to load bookings");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!user || user.role !== "customer") return undefined;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchBookings();
    }, [user]);

    const stats = useMemo(
        () => ({
            total: bookings.length,
            pending: bookings.filter((item) => item.status === "pending").length,
            accepted: bookings.filter((item) => item.status === "accepted").length,
            completed: bookings.filter((item) => item.status === "completed").length,
        }),
        [bookings]
    );

    const filteredBookings = useMemo(() => {
        if (statusFilter === "all") return bookings;
        return bookings.filter((item) => item.status === statusFilter);
    }, [bookings, statusFilter]);

    if (ready && user?.role && user.role !== "customer") {
        return <Navigate to={dashboardPath(user.role)} replace />;
    }

    return (
        <div className="min-h-[80vh] bg-canvas/15 dark:bg-transparent py-10">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 space-y-8 animate-fade-up">
                {/* Welcoming Header Card */}
                <div className="relative overflow-hidden rounded-3xl bg-ink dark:bg-[#12151e] border border-transparent dark:border-line px-6 py-10 text-white sm:px-10 shadow-lg">
                    {/* Background abstract visual layers */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:16px_16px]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(15,118,110,0.18),_transparent_60%)]" />

                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                        <div className="space-y-1.5">
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-teal-300">
                                <Sparkles size={11} className="stroke-[2.5]" />
                                Customer Workspace
                            </span>
                            <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
                                Welcome back{user?.name ? `, ${user.name}` : ""}
                            </h1>
                            <p className="text-sm font-medium text-zinc-400">
                                {user?.email || "Track your current booking orders and hire professionals."}
                            </p>
                        </div>
                        <Link
                            to="/become-provider"
                            className="shrink-0 inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/20 bg-white/5 px-4.5 py-2.5 text-xs font-bold text-white hover:bg-white/10 transition-all duration-200"
                        >
                            Become a Provider
                        </Link>
                    </div>
                </div>

                {/* Statistics Grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div
                        onClick={() => setStatusFilter("all")}
                        className="cursor-pointer transition-transform hover:-translate-y-0.5"
                    >
                        <StatCard icon={Inbox} label="Total bookings" value={stats.total} />
                    </div>
                    <div
                        onClick={() => setStatusFilter("pending")}
                        className="cursor-pointer transition-transform hover:-translate-y-0.5"
                    >
                        <StatCard icon={Clock} label="Pending orders" value={stats.pending} tone="amber" />
                    </div>
                    <div
                        onClick={() => setStatusFilter("accepted")}
                        className="cursor-pointer transition-transform hover:-translate-y-0.5"
                    >
                        <StatCard icon={CheckCircle} label="In progress" value={stats.accepted} tone="teal" />
                    </div>
                    <div
                        onClick={() => setStatusFilter("completed")}
                        className="cursor-pointer transition-transform hover:-translate-y-0.5"
                    >
                        <StatCard icon={CheckCircle} label="Completed jobs" value={stats.completed} tone="sky" />
                    </div>
                </div>

                {/* Bookings Header & Tabs */}
                <div className="space-y-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="font-display text-2xl font-bold tracking-tight text-ink dark:text-white">
                                My booking requests
                            </h2>
                            <p className="mt-1 text-sm text-muted dark:text-zinc-400">
                                Track orders, chat with providers, and leave reviews.
                            </p>
                        </div>
                        <Link
                            to="/services"
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-ink dark:bg-teal-600 px-4.5 py-2.5 text-center text-xs font-bold text-white hover:bg-zinc-800 dark:hover:bg-teal-700 transition-all duration-150 active:scale-98 shadow-sm"
                        >
                            <Plus size={15} className="stroke-[2.5]" />
                            Book new services
                        </Link>
                    </div>

                    {/* Status Filter Tabs */}
                    <div className="flex flex-wrap items-center gap-2 border-b border-line/60 dark:border-line pb-3">
                        {[
                            { key: "all", label: "All Bookings", count: stats.total },
                            { key: "pending", label: "Pending", count: stats.pending },
                            { key: "accepted", label: "Accepted", count: stats.accepted },
                            { key: "completed", label: "Completed", count: stats.completed },
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                type="button"
                                onClick={() => setStatusFilter(tab.key)}
                                className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
                                    statusFilter === tab.key
                                        ? "bg-ink dark:bg-teal-600 text-white shadow-sm"
                                        : "bg-white dark:bg-[#11131a] text-muted dark:text-zinc-400 hover:bg-canvas dark:hover:bg-white/5 hover:text-ink dark:hover:text-white border border-line/60 dark:border-line"
                                  }`}
                            >
                                <span>{tab.label}</span>
                                <span
                                    className={`rounded-full px-1.5 py-0.2 text-[10px] font-extrabold ${
                                        statusFilter === tab.key
                                            ? "bg-white/20 text-white"
                                            : "bg-canvas dark:bg-white/10 text-muted dark:text-zinc-400"
                                    }`}
                                >
                                    {tab.count}
                                </span>
                            </button>
                        ))}
                    </div>

                    {loading && <Loading label="Retrieving bookings..." />}

                    {!loading && error && (
                        <div className="rounded-2xl border border-rose-100 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/30 p-5 text-sm font-semibold text-rose-700 dark:text-rose-400 shadow-sm">
                            {error}
                        </div>
                    )}

                    {!loading && !error && filteredBookings.length === 0 && (
                        <EmptyState
                            icon={CalendarDays}
                            title={
                                statusFilter === "all"
                                    ? "No bookings ordered yet"
                                    : `No ${statusFilter} bookings found`
                            }
                            description={
                                statusFilter === "all"
                                    ? "Browse our verified service catalogue to submit your very first booking request."
                                    : `You currently have no orders in the “${statusFilter}” state.`
                            }
                            action={
                                statusFilter === "all" ? (
                                    <Link
                                        to="/services"
                                        className="inline-flex rounded-xl bg-ink dark:bg-teal-600 px-5 py-3 text-sm font-bold text-white shadow-md hover:bg-zinc-800 dark:hover:bg-teal-700 active:scale-98 transition-all"
                                    >
                                        Explore services catalogue
                                    </Link>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => setStatusFilter("all")}
                                        className="inline-flex rounded-xl border border-line dark:border-line bg-white dark:bg-[#11131a] px-4 py-2.5 text-xs font-bold text-ink dark:text-zinc-200 hover:bg-canvas dark:hover:bg-white/5 shadow-sm"
                                    >
                                        View all bookings
                                    </button>
                                )
                            }
                        />
                    )}

                    {!loading && !error && filteredBookings.length > 0 && (
                        <div className="grid gap-4.5">
                            {filteredBookings.map((booking) => (
                                <BookingCard
                                    key={booking._id}
                                    booking={booking}
                                    onChat={(b) => setChatBooking(b)}
                                    actions={
                                        booking.status === "completed" ? (
                                            <button
                                                type="button"
                                                onClick={() => setReviewBooking(booking)}
                                                className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition-all active:scale-98 cursor-pointer"
                                            >
                                                <Star size={13} className="fill-white" />
                                                Write a Review
                                            </button>
                                        ) : null
                                    }
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Real-time Chat Modal */}
            <ChatModal
                open={Boolean(chatBooking)}
                booking={chatBooking}
                onClose={() => setChatBooking(null)}
                currentUser={user}
            />

            {/* Write Review Modal */}
            <ReviewModal
                open={Boolean(reviewBooking)}
                booking={reviewBooking}
                onClose={() => setReviewBooking(null)}
                onSuccess={() => {
                    fetchBookings();
                }}
            />
        </div>
    );
}

export default Dashboard;
