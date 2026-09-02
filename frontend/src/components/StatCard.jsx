function StatCard({ icon: Icon, label, value, tone = "default" }) {
    const tones = {
        default: {
            text: "text-muted dark:text-zinc-400",
            bg: "bg-canvas dark:bg-white/5",
            icon: "text-muted dark:text-zinc-400",
        },
        amber: {
            text: "text-amber-700 dark:text-amber-300",
            bg: "bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/40",
            icon: "text-amber-600 dark:text-amber-400",
        },
        teal: {
            text: "text-teal-700 dark:text-teal-300",
            bg: "bg-teal-50 dark:bg-teal-950/40 border border-teal-100 dark:border-teal-900/40",
            icon: "text-teal-600 dark:text-teal-400",
        },
        sky: {
            text: "text-sky-700 dark:text-sky-300",
            bg: "bg-sky-50 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900/40",
            icon: "text-sky-600 dark:text-sky-400",
        },
        rose: {
            text: "text-rose-700 dark:text-rose-300",
            bg: "bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/40",
            icon: "text-rose-600 dark:text-rose-400",
        },
    };

    const activeTone = tones[tone] || tones.default;

    return (
        <div className="rounded-2xl border border-line/60 dark:border-line bg-white dark:bg-[#11131a] p-5 shadow-sm transition-all duration-200 hover:shadow-md flex items-center justify-between gap-4">
            <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wider text-muted dark:text-zinc-400">{label}</p>
                <p className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink dark:text-white">
                    {value}
                </p>
            </div>

            {Icon && (
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${activeTone.bg}`}>
                    <Icon size={20} className={activeTone.icon} />
                </div>
            )}
        </div>
    );
}

export default StatCard;
