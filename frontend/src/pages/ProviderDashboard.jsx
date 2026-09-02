import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
    BriefcaseBusiness,
    CheckCircle,
    Clock,
    Plus,
    Sparkles,
    Check,
    X,
    FolderGit2,
} from "lucide-react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";
import BookingCard from "../components/BookingCard";
import StatCard from "../components/StatCard";
import ConfirmDialog from "../components/ConfirmDialog";
import ChatModal from "../components/ChatModal";

function ProviderDashboard() {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [confirm, setConfirm] = useState(null);
    const [busy, setBusy] = useState(false);
    const [chatBooking, setChatBooking] = useState(null);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const response = await API.get("/bookings/provider");
            setBookings(response.data.bookings || []);
        } catch (err) {
            setError(err.response?.data?.message || "Unable to load bookings");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchBookings();
    }, []);

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

    const runAction = async () => {
        if (!confirm) return;

        try {
            setBusy(true);
            if (confirm.type === "complete") {
                await API.patch(`/bookings/${confirm.id}/complete`);
            } else {
                await API.patch(`/bookings/${confirm.id}/status`, {
                    status: confirm.type,
                });
            }
            setConfirm(null);
            await fetchBookings();
        } catch (err) {
            setError(err.response?.data?.message || "Unable to update booking");
            setConfirm(null);
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="min-h-[80vh] bg-canvas/15 dark:bg-transparent py-10">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 space-y-8 animate-fade-up">
                {/* Provider Dashboard Hero Banner */}
                <div className="relative overflow-hidden rounded-3xl bg-ink dark:bg-[#12151e] border border-transparent dark:border-line px-6 py-10 text-white sm:px-10 shadow-lg">
                    {/* Background visual graphics */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:16px_16px]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(20,184,166,0.15),_transparent_60%)]" />

                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                        <div className="space-y-1.5">
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-teal-300">
                                <Sparkles size={11} className="stroke-[2.5]" />
                                Provider Studio Workspace
                            </span>
                            <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
                                {user?.name || "Your provider workspace"}
                            </h1>
                            <p className="text-sm font-medium text-zinc-400">
                                {user?.email || "Manage incoming bookings, configure listings, and process orders."}
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <Link
                                to="/my-services"
                                className="shrink-0 inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/5 px-4.5 py-3 text-xs font-bold text-white hover:bg-white/10 transition-all duration-200"
                            >
                                <FolderGit2 size={14} />
                                My Services
                            </Link>
                            <Link
                                to="/add-service"
                                className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-white text-ink hover:bg-zinc-100 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-98 shadow-md px-5 py-3 text-xs font-bold"
                            >
                                <Plus size={15} className="stroke-[2.5]" />
                                List new service
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Statistics Grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div
                        onClick={() => setStatusFilter("all")}
                        className="cursor-pointer transition-transform hover:-translate-y-0.5"
                    >
                        <StatCard icon={BriefcaseBusiness} label="Total orders" value={stats.total} />
                    </div>
                    <div
                        onClick={() => setStatusFilter("pending")}
                        className="cursor-pointer transition-transform hover:-translate-y-0.5"
                    >
                        <StatCard icon={Clock} label="Incoming requests" value={stats.pending} tone="amber" />
                    </div>
                    <div
                        onClick={() => setStatusFilter("accepted")}
                        className="cursor-pointer transition-transform hover:-translate-y-0.5"
                    >
                        <StatCard icon={CheckCircle} label="Active bookings" value={stats.accepted} tone="teal" />
                    </div>
                    <div
                        onClick={() => setStatusFilter("completed")}
                        className="cursor-pointer transition-transform hover:-translate-y-0.5"
                    >
                        <StatCard icon={CheckCircle} label="Completed deliveries" value={stats.completed} tone="sky" />
                    </div>
                </div>

                {/* Incoming bookings block */}
                <div className="space-y-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="font-display text-2xl font-bold tracking-tight text-ink dark:text-white">Incoming bookings</h2>
                            <p className="mt-1 text-sm text-muted dark:text-zinc-400">Respond to booking orders and manage complete cycles.</p>
                        </div>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex flex-wrap items-center gap-2 border-b border-line/60 dark:border-line pb-3">
                        {[
                            { key: "all", label: "All Orders", count: stats.total },
                            { key: "pending", label: "Pending Requests", count: stats.pending },
                            { key: "accepted", label: "Active Jobs", count: stats.accepted },
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

                    {loading && <Loading label="Retrieving provider bookings..." />}

                    {!loading && error && (
                        <div className="rounded-2xl border border-rose-100 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/30 p-5 text-sm font-semibold text-rose-700 dark:text-rose-400 shadow-sm">
                            {error}
                        </div>
                    )}

                    {!loading && !error && filteredBookings.length === 0 && (
                        <EmptyState
                            icon={BriefcaseBusiness}
                            title={
                                statusFilter === "all"
                                    ? "No booking requests yet"
                                    : `No ${statusFilter} orders found`
                            }
                            description={
                                statusFilter === "all"
                                    ? "When customers book your published listings, incoming requests will appear here."
                                    : `You currently have no booking orders with “${statusFilter}” status.`
                            }
                            action={
                                statusFilter === "all" ? (
                                    <Link
                                        to="/add-service"
                                        className="inline-flex rounded-xl bg-ink dark:bg-teal-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-zinc-800 dark:hover:bg-teal-700 transition-all cursor-pointer"
                                    >
                                        List a new service
                                    </Link>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => setStatusFilter("all")}
                                        className="inline-flex rounded-xl border border-line dark:border-line bg-white dark:bg-[#11131a] px-4 py-2.5 text-xs font-bold text-ink dark:text-zinc-200 hover:bg-canvas dark:hover:bg-white/5 shadow-sm cursor-pointer"
                                    >
                                        View all orders
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
                                        <>
                                            {booking.status === "pending" && (
                                                <div className="flex gap-2 w-full sm:w-auto">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setConfirm({
                                                                id: booking._id,
                                                                type: "accepted",
                                                                title: "Accept this booking request?",
                                                                description:
                                                                    "By accepting, you commit to deliver this service. The customer status will update to active.",
                                                            })
                                                        }
                                                        className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 active:scale-98 transition-all cursor-pointer shadow-sm"
                                                    >
                                                        <Check size={14} className="stroke-[2.5]" />
                                                        Accept Order
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setConfirm({
                                                                id: booking._id,
                                                                type: "rejected",
                                                                title: "Decline this request?",
                                                                description:
                                                                    "Declining this request will mark the booking as rejected. This status action cannot be undone.",
                                                                danger: true,
                                                            })
                                                        }
                                                        className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700 active:scale-98 transition-all cursor-pointer shadow-sm"
                                                    >
                                                        <X size={14} className="stroke-[2.5]" />
                                                        Decline
                                                    </button>
                                                </div>
                                            )}
                                            {booking.status === "accepted" && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setConfirm({
                                                            id: booking._id,
                                                            type: "complete",
                                                            title: "Mark project delivery complete?",
                                                            description:
                                                                "Use this when you have successfully completed all deliverables for the client.",
                                                        })
                                                    }
                                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-ink dark:bg-teal-600 px-4 py-2 text-xs font-bold text-white hover:bg-zinc-800 dark:hover:bg-teal-700 active:scale-98 transition-all cursor-pointer shadow-sm"
                                                >
                                                    <CheckCircle size={14} className="stroke-[2.5]" />
                                                    Mark Completed
                                                </button>
                                            )}
                                        </>
                                    }
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <ChatModal
                open={Boolean(chatBooking)}
                booking={chatBooking}
                onClose={() => setChatBooking(null)}
                currentUser={user}
            />

            <ConfirmDialog
                open={Boolean(confirm)}
                title={confirm?.title}
                description={confirm?.description}
                danger={confirm?.danger}
                loading={busy}
                confirmLabel="Confirm Action"
                onCancel={() => !busy && setConfirm(null)}
                onConfirm={runAction}
            />
        </div>
    );
}

export default ProviderDashboard;
