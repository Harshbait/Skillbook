import { useEffect, useMemo, useState } from "react";
import { UserCheck, UserX, Users, Shield, Award, Check, UserMinus } from "lucide-react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import ConfirmDialog from "../components/ConfirmDialog";
import { formatDate } from "../utils/constants";

function AdminDashboard() {
    const { user } = useAuth();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [confirm, setConfirm] = useState(null);
    const [busy, setBusy] = useState(false);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const response = await API.get("/admin/providers");
            setApplications(response.data.applications || []);
        } catch (err) {
            setError(err.response?.data?.message || "Unable to load provider applications");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchApplications();
    }, []);

    const stats = useMemo(
        () => ({
            total: applications.length,
            pending: applications.filter((item) => item.status === "pending").length,
            approved: applications.filter((item) => item.status === "approved").length,
            rejected: applications.filter((item) => item.status === "rejected").length,
            revoked: applications.filter((item) => item.status === "revoked").length,
        }),
        [applications]
    );

    const filteredApplications = useMemo(() => {
        if (statusFilter === "all") return applications;
        return applications.filter((item) => item.status === statusFilter);
    }, [applications, statusFilter]);

    const runAction = async () => {
        if (!confirm) return;

        try {
            setBusy(true);
            let path;
            if (confirm.type === "approve") {
                path = `/admin/providers/${confirm.id}/approve`;
            } else if (confirm.type === "reject") {
                path = `/admin/providers/${confirm.id}/reject`;
            } else if (confirm.type === "revoke") {
                path = `/admin/providers/${confirm.id}/revoke`;
            }

            await API.patch(path);
            setConfirm(null);
            await fetchApplications();
        } catch (err) {
            setError(err.response?.data?.message || "Unable to update application");
            setConfirm(null);
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="min-h-[80vh] bg-canvas/15 dark:bg-transparent py-10">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 space-y-8 animate-fade-up">
                {/* Admin Dashboard Hero Banner */}
                <div className="relative overflow-hidden rounded-3xl bg-ink dark:bg-[#12151e] border border-transparent dark:border-line px-6 py-10 text-white sm:px-10 shadow-lg">
                    {/* Background visual layers */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:16px_16px]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(13,148,136,0.18),_transparent_65%)]" />

                    <div className="relative z-10 space-y-1.5">
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-teal-300">
                            <Shield size={11} className="stroke-[2.5]" />
                            Platform Administration
                        </span>
                        <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
                            Provider Onboarding & Access Controls
                        </h1>
                        <p className="text-sm font-medium text-zinc-400">
                            {user?.email || "Authorize, verify credentials, and manage marketplace provider access."}
                        </p>
                    </div>
                </div>

                {/* Statistics Grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div
                        onClick={() => setStatusFilter("all")}
                        className="cursor-pointer transition-transform hover:-translate-y-0.5"
                    >
                        <StatCard icon={Users} label="Total applications" value={stats.total} />
                    </div>
                    <div
                        onClick={() => setStatusFilter("pending")}
                        className="cursor-pointer transition-transform hover:-translate-y-0.5"
                    >
                        <StatCard icon={Users} label="Under review" value={stats.pending} tone="amber" />
                    </div>
                    <div
                        onClick={() => setStatusFilter("approved")}
                        className="cursor-pointer transition-transform hover:-translate-y-0.5"
                    >
                        <StatCard icon={UserCheck} label="Approved providers" value={stats.approved} tone="teal" />
                    </div>
                    <div
                        onClick={() => setStatusFilter("rejected")}
                        className="cursor-pointer transition-transform hover:-translate-y-0.5"
                    >
                        <StatCard icon={UserX} label="Declined profiles" value={stats.rejected} tone="rose" />
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="space-y-6">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="font-display text-2xl font-bold tracking-tight text-ink dark:text-white">Provider management</h2>
                            <p className="mt-1 text-sm text-muted dark:text-zinc-400">Review credentials, verify onboarding applications, and manage provider status.</p>
                        </div>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex flex-wrap items-center gap-2 border-b border-line/60 dark:border-line pb-3">
                        {[
                            { key: "all", label: "All Profiles", count: stats.total },
                            { key: "pending", label: "Under Review", count: stats.pending },
                            { key: "approved", label: "Approved Providers", count: stats.approved },
                            { key: "rejected", label: "Declined", count: stats.rejected },
                            { key: "revoked", label: "Revoked", count: stats.revoked },
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

                    {loading && <Loading label="Retrieving system applications..." />}

                    {!loading && error && (
                        <div className="rounded-2xl border border-rose-100 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/30 p-5 text-sm font-semibold text-rose-700 dark:text-rose-400 shadow-sm">
                            {error}
                        </div>
                    )}

                    {!loading && !error && filteredApplications.length === 0 && (
                        <EmptyState
                            icon={Users}
                            title={
                                statusFilter === "all"
                                    ? "No applications submitted yet"
                                    : `No ${statusFilter} applications found`
                            }
                            description={
                                statusFilter === "all"
                                    ? "When customers apply to offer services on the marketplace, requests will appear here."
                                    : `There are currently no provider profiles in “${statusFilter}” state.`
                            }
                        />
                    )}

                    {!loading && !error && filteredApplications.length > 0 && (
                        <div className="grid gap-5">
                            {filteredApplications.map((application) => (
                                <article
                                    key={application._id}
                                    className="rounded-2xl border border-line dark:border-line bg-white dark:bg-[#11131a] p-6 shadow-sm transition-all duration-200 hover:shadow-md"
                                >
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between border-b border-line/50 dark:border-line pb-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-display text-lg font-bold text-ink dark:text-white leading-none">
                                                    {application.user?.name || "Applicant Profile"}
                                                </h3>
                                                <span className="text-[10px] font-semibold text-muted dark:text-zinc-400 bg-canvas dark:bg-white/5 px-2 py-0.5 rounded border border-line/50 dark:border-line">
                                                    Applied {formatDate(application.createdAt)}
                                                </span>
                                            </div>
                                            <p className="text-xs font-semibold text-muted dark:text-zinc-400">
                                                {application.user?.email || "No email available"}
                                            </p>
                                        </div>
                                        <StatusBadge status={application.status} />
                                    </div>

                                    {/* Application Detail grid */}
                                    <div className="mt-5 grid gap-5 text-xs sm:grid-cols-2">
                                        <div className="space-y-1.5">
                                            <span className="font-bold uppercase tracking-wider text-muted dark:text-zinc-400 block">
                                                Skills & Expertise
                                            </span>
                                            <div className="flex flex-wrap gap-1.5">
                                                {application.skills?.length ? (
                                                    application.skills.map((skill, index) => (
                                                        <span
                                                            key={index}
                                                            className="text-xs font-semibold text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/40 border border-teal-200/60 dark:border-teal-800/40 px-2.5 py-1 rounded-lg"
                                                        >
                                                            {skill}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-xs text-muted dark:text-zinc-400">—</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <span className="font-bold uppercase tracking-wider text-muted dark:text-zinc-400 block">
                                                Experience Level
                                            </span>
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-ink dark:text-zinc-200 bg-canvas dark:bg-white/5 px-3 py-1.5 rounded-xl border border-line/50 dark:border-line inline-flex">
                                                <Award size={14} className="text-accent dark:text-teal-400" />
                                                <span>{application.experience ?? 0} years experience</span>
                                            </div>
                                        </div>
                                        <div className="sm:col-span-2 space-y-1.5">
                                            <span className="font-bold uppercase tracking-wider text-muted dark:text-zinc-400 block">
                                                Bio & Application Note
                                            </span>
                                            <p className="text-xs leading-relaxed text-ink/85 dark:text-zinc-300 bg-canvas/40 dark:bg-white/5 p-4 rounded-xl border border-line/50 dark:border-line whitespace-pre-wrap">
                                                {application.bio || "No description provided."}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Actions toolbar for Pending applications */}
                                    {application.status === "pending" && (
                                        <div className="mt-5 flex flex-wrap gap-2.5 border-t border-line/50 dark:border-line pt-5">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setConfirm({
                                                        id: application._id,
                                                        type: "approve",
                                                        title: "Approve provider application?",
                                                        description: `This will grant provider permissions to ${application.user?.name || "the user"}. Their user role will update to provider.`,
                                                    })
                                                }
                                                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 active:scale-98 transition-all cursor-pointer shadow-sm"
                                            >
                                                <Check size={14} className="stroke-[2.5]" />
                                                Approve Provider
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setConfirm({
                                                        id: application._id,
                                                        type: "reject",
                                                        title: "Decline application?",
                                                        description: `This will decline ${application.user?.name || "the user"}'s onboarding request. Their account role will remain as a customer.`,
                                                        danger: true,
                                                    })
                                                }
                                                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700 active:scale-98 transition-all cursor-pointer shadow-sm"
                                            >
                                                <UserX size={14} className="stroke-[2.5]" />
                                                Decline Profile
                                            </button>
                                        </div>
                                    )}

                                    {/* Actions toolbar for Approved providers - Revoke Access */}
                                    {application.status === "approved" && (
                                        <div className="mt-5 flex flex-wrap gap-2.5 border-t border-line/50 dark:border-line pt-5">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setConfirm({
                                                        id: application._id,
                                                        type: "revoke",
                                                        title: "Revoke provider access?",
                                                        description: `This will remove provider privileges from ${application.user?.name || "the user"}. Their account role will revert to customer.`,
                                                        danger: true,
                                                    })
                                                }
                                                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700 active:scale-98 transition-all cursor-pointer shadow-sm"
                                            >
                                                <UserMinus size={14} className="stroke-[2.5]" />
                                                Revoke Provider Access
                                            </button>
                                        </div>
                                    )}
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </div>

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

export default AdminDashboard;
