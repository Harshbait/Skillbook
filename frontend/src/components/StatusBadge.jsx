const STYLES = {
    pending: "bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 ring-amber-200 dark:ring-amber-800/40",
    accepted: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 ring-emerald-200 dark:ring-emerald-800/40",
    approved: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 ring-emerald-200 dark:ring-emerald-800/40",
    rejected: "bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 ring-rose-200 dark:ring-rose-800/40",
    revoked: "bg-purple-50 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300 ring-purple-200 dark:ring-purple-800/40",
    completed: "bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300 ring-sky-200 dark:ring-sky-800/40",
    cancelled: "bg-stone-100 dark:bg-white/10 text-stone-600 dark:text-zinc-300 ring-stone-200 dark:ring-white/10",
};

function StatusBadge({ status = "pending" }) {
    const key = String(status).toLowerCase();
    const style = STYLES[key] || "bg-stone-100 dark:bg-white/10 text-stone-700 dark:text-zinc-300 ring-stone-200 dark:ring-white/10";

    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ${style}`}
        >
            {status}
        </span>
    );
}

export default StatusBadge;
