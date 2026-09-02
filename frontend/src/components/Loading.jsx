import { LoaderCircle } from "lucide-react";

function Loading({ label = "Loading..." }) {
    return (
        <div
            className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-muted dark:text-zinc-400"
            role="status"
            aria-live="polite"
        >
            <LoaderCircle className="animate-spin text-accent dark:text-teal-400" size={28} />
            <p className="text-sm font-medium">{label}</p>
        </div>
    );
}

export function SkeletonGrid({ count = 6 }) {
    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: count }).map((_, index) => (
                <div
                    key={index}
                    className="overflow-hidden rounded-2xl border border-line dark:border-line bg-white dark:bg-[#11131a]"
                >
                    <div className="h-44 animate-pulse bg-stone-100 dark:bg-white/5" />
                    <div className="space-y-3 p-5">
                        <div className="h-4 w-24 animate-pulse rounded bg-stone-100 dark:bg-white/5" />
                        <div className="h-5 w-3/4 animate-pulse rounded bg-stone-100 dark:bg-white/5" />
                        <div className="h-4 w-full animate-pulse rounded bg-stone-100 dark:bg-white/5" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Loading;
