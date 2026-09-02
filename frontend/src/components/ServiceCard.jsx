import { Link } from "react-router-dom";
import { ArrowRight, Clock, Code2, Palette, Megaphone, PenTool, User } from "lucide-react";
import { formatPrice } from "../utils/constants";

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

function ServiceCard({ service }) {
    const category = service.category || "Development";
    const theme = CATEGORY_THEMES[category] || CATEGORY_THEMES.Development;
    const IconComponent = theme.icon;
    const providerName = service.provider?.name || "SkillBook Provider";

    return (
        <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line/65 dark:border-line bg-white dark:bg-[#11131a] shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg hover:border-line">
            {/* Header graphic representing the category */}
            <div className={`relative flex h-40 shrink-0 items-center justify-center bg-gradient-to-br ${theme.gradient} overflow-hidden`}>
                {/* Abstract graphic grid overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:16px_16px]" />
                <div className="absolute -right-6 -bottom-6 text-white/5 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                    <IconComponent size={140} className="stroke-[1.5]" />
                </div>

                <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-inner">
                    <IconComponent size={24} className="stroke-[2.2]" />
                </div>

                <span className={`absolute left-4 top-4 rounded-full border px-2.5 py-0.5 text-xs font-semibold backdrop-blur-md ${theme.accent}`}>
                    {category}
                </span>
            </div>

            <div className="flex flex-1 flex-col p-5">
                <div className="flex items-start justify-between gap-4">
                    <h3 className="font-display text-lg font-bold leading-snug text-ink dark:text-zinc-100 line-clamp-1 group-hover:text-accent dark:group-hover:text-teal-400 transition-colors duration-200">
                        {service.title}
                    </h3>
                </div>

                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted dark:text-zinc-400">
                    {service.description}
                </p>

                <div className="mt-4 flex items-center justify-between border-y border-line/50 dark:border-line py-3.5 text-sm">
                    <span className="flex items-center gap-1.5 font-medium text-muted dark:text-zinc-400">
                        <Clock size={14} className="text-muted/80 dark:text-zinc-400" />
                        {service.duration}
                    </span>
                    <span className="font-display text-lg font-extrabold text-accent dark:text-teal-400">
                        {formatPrice(service.price)}
                    </span>
                </div>

                <div className="mt-auto flex items-center justify-between pt-4">
                    <div className="flex items-center gap-2 min-w-0 pr-2">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-canvas dark:bg-white/10 text-muted dark:text-zinc-400">
                            <User size={13} className="stroke-[2]" />
                        </div>
                        <span className="truncate text-xs font-semibold text-muted dark:text-zinc-400 leading-none">
                            {providerName}
                        </span>
                    </div>

                    <Link
                        to={`/services/${service._id}`}
                        className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-ink dark:bg-teal-600 px-3.5 text-xs font-bold text-white hover:bg-zinc-800 dark:hover:bg-teal-700 transition-all duration-200 active:scale-98"
                    >
                        View details
                        <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                    </Link>
                </div>
            </div>
        </article>
    );
}

export default ServiceCard;
