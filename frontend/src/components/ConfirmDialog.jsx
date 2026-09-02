import { useEffect } from "react";

function ConfirmDialog({
    open,
    title,
    description,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    danger = false,
    loading = false,
    onConfirm,
    onCancel,
}) {
    useEffect(() => {
        if (!open) return undefined;

        const onKeyDown = (event) => {
            if (event.key === "Escape" && !loading) onCancel?.();
        };

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [open, loading, onCancel]);

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-end justify-center bg-ink/60 p-4 sm:items-center backdrop-blur-xs"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
        >
            <button
                type="button"
                className="absolute inset-0 cursor-default"
                aria-label="Close dialog"
                onClick={loading ? undefined : onCancel}
            />

            <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-[#13161f] border border-line dark:border-line p-6 shadow-xl animate-fade-up">
                <h2 id="confirm-title" className="text-lg font-semibold text-ink dark:text-zinc-100">
                    {title}
                </h2>
                {description && (
                    <p className="mt-2 text-sm leading-6 text-muted dark:text-zinc-400">{description}</p>
                )}

                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="rounded-xl border border-line dark:border-line px-4 py-2.5 text-sm font-medium text-ink dark:text-zinc-300 hover:bg-canvas dark:hover:bg-white/5 disabled:opacity-50 cursor-pointer"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={loading}
                        className={`rounded-xl px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50 cursor-pointer ${
                            danger
                                ? "bg-rose-600 hover:bg-rose-700"
                                : "bg-ink dark:bg-teal-600 hover:bg-zinc-800 dark:hover:bg-teal-700"
                        }`}
                    >
                        {loading ? "Please wait..." : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmDialog;
