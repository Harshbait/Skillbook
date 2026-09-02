import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Briefcase, Plus, ExternalLink, Edit2, Trash2, Clock, ArrowLeft } from "lucide-react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";
import ConfirmDialog from "../components/ConfirmDialog";
import { fetchAllServices, formatPrice, isOwnService } from "../utils/constants";

function MyServices() {
    const { user } = useAuth();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [pendingDelete, setPendingDelete] = useState(null);
    const [busy, setBusy] = useState(false);

    const load = async () => {
        try {
            setLoading(true);
            setError("");
            const all = await fetchAllServices(API);
            setServices(all.filter((service) => isOwnService(service, user)));
        } catch (err) {
            setError(err.response?.data?.message || "Unable to load your services");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const handleDelete = async () => {
        if (!pendingDelete) return;

        try {
            setBusy(true);
            await API.delete(`/services/${pendingDelete._id}`);
            setPendingDelete(null);
            await load();
        } catch (err) {
            setError(err.response?.data?.message || "Unable to delete service");
            setPendingDelete(null);
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="min-h-[85vh] bg-canvas/15 dark:bg-transparent py-10 sm:py-12">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 space-y-8 animate-fade-up">
                {/* Back Nav Link */}
                <p className="text-xs font-semibold text-muted dark:text-zinc-400">
                    <Link to="/provider/dashboard" className="hover:text-ink dark:hover:text-white flex items-center gap-1">
                        <ArrowLeft size={13} className="stroke-[2.5]" />
                        Back to Provider Dashboard
                    </Link>
                </p>

                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                        <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink dark:text-white sm:text-4xl">
                            My Published Services
                        </h1>
                        <p className="text-sm text-muted dark:text-zinc-400">
                            Manage and configure your live marketplace listings.
                        </p>
                    </div>

                    <Link
                        to="/add-service"
                        className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-ink dark:bg-teal-600 px-5 py-3 text-xs font-bold text-white hover:bg-zinc-800 dark:hover:bg-teal-700 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-98 shadow-md"
                    >
                        <Plus size={15} className="stroke-[2.5]" />
                        Create New Listing
                    </Link>
                </div>

                {loading && <Loading label="Loading your service catalog..." />}

                {!loading && error && (
                    <div className="rounded-2xl border border-rose-100 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/30 p-5 text-sm font-semibold text-rose-700 dark:text-rose-400 shadow-sm">
                        {error}
                    </div>
                )}

                {!loading && !error && services.length === 0 && (
                    <EmptyState
                        icon={Briefcase}
                        title="You haven't listed any services yet"
                        description="Create your first fixed-price package to allow clients to discover and book your work."
                        action={
                            <Link
                                to="/add-service"
                                className="inline-flex rounded-xl bg-ink dark:bg-teal-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-zinc-800 dark:hover:bg-teal-700 transition-all cursor-pointer"
                            >
                                Publish your first service
                            </Link>
                        }
                    />
                )}

                {!loading && !error && services.length > 0 && (
                    <div className="grid gap-5">
                        {services.map((service) => (
                            <article
                                key={service._id}
                                className="rounded-2xl border border-line dark:border-line bg-white dark:bg-[#11131a] p-5 sm:p-6 shadow-sm transition-all duration-200 hover:shadow-md"
                            >
                                <div className="flex flex-col gap-4.5 sm:flex-row sm:items-start sm:justify-between">
                                    <div className="space-y-2.5 min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded bg-canvas dark:bg-white/5 text-muted dark:text-zinc-300 border border-line/50 dark:border-line">
                                                {service.category}
                                            </span>
                                            <span className="inline-flex items-center gap-1 text-xs font-medium text-muted dark:text-zinc-400">
                                                <Clock size={12} />
                                                {service.duration}
                                            </span>
                                        </div>
                                        
                                        <h2 className="font-display text-xl font-bold text-ink dark:text-white leading-snug">
                                            {service.title}
                                        </h2>
                                        
                                        <p className="line-clamp-2 text-sm leading-relaxed text-muted dark:text-zinc-400">
                                            {service.description}
                                        </p>
                                        
                                        <div className="inline-block pt-1 text-base font-bold text-accent dark:text-teal-400">
                                            Fixed price: {formatPrice(service.price)}
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-wrap gap-2 sm:self-start">
                                        <Link
                                            to={`/services/${service._id}`}
                                            className="inline-flex items-center gap-1 rounded-xl border border-line dark:border-line bg-white dark:bg-[#161922] px-3.5 py-2 text-xs font-bold text-ink dark:text-zinc-200 hover:bg-canvas dark:hover:bg-white/5 shadow-sm transition-all duration-150"
                                        >
                                            <ExternalLink size={13} />
                                            View Page
                                        </Link>
                                        <Link
                                            to={`/my-services/${service._id}/edit`}
                                            className="inline-flex items-center gap-1 rounded-xl border border-line dark:border-line bg-white dark:bg-[#161922] px-3.5 py-2 text-xs font-bold text-ink dark:text-zinc-200 hover:bg-canvas dark:hover:bg-white/5 shadow-sm transition-all duration-150"
                                        >
                                            <Edit2 size={13} />
                                            Edit Info
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => setPendingDelete(service)}
                                            className="inline-flex items-center gap-1 rounded-xl bg-rose-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-rose-700 active:scale-98 transition-all duration-150 cursor-pointer shadow-sm"
                                        >
                                            <Trash2 size={13} />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}

                <ConfirmDialog
                    open={Boolean(pendingDelete)}
                    title="Permanently delete this service listing?"
                    description={`This will permanently remove “${pendingDelete?.title}” from the platform. Any ongoing customer bookings will remain, but new orders will not be possible.`}
                    confirmLabel="Delete Listing"
                    danger
                    loading={busy}
                    onCancel={() => !busy && setPendingDelete(null)}
                    onConfirm={handleDelete}
                />
            </div>
        </div>
    );
}

export default MyServices;
