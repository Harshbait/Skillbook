function EmptyState({ icon: Icon, title, description, action }) {
    return (
        <div className="rounded-2xl border border-dashed border-line dark:border-line bg-white dark:bg-[#11131a] px-6 py-16 text-center">
            {Icon && (
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-canvas dark:bg-white/5 text-muted dark:text-zinc-400">
                    <Icon size={22} />
                </div>
            )}
            <h3 className="mt-4 text-xl font-semibold text-ink dark:text-zinc-100">{title}</h3>
            {description && (
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted dark:text-zinc-400">
                    {description}
                </p>
            )}
            {action && <div className="mt-6">{action}</div>}
        </div>
    );
}

export default EmptyState;
