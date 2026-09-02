import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    ArrowRight,
    Search,
    Code2,
    Palette,
    Megaphone,
    PenLine,
    ShieldCheck,
    Sparkles,
    Clock,
    CheckCircle,
} from "lucide-react";
import API from "../services/api";
import ServiceCard from "../components/ServiceCard";
import { CATEGORIES } from "../utils/constants";

const categoryThemes = {
    Development: {
        icon: Code2,
        bg: "bg-teal-50 text-teal-700 group-hover:bg-teal-600 group-hover:text-white",
        border: "hover:border-teal-500/30 hover:shadow-teal-500/5",
    },
    Design: {
        icon: Palette,
        bg: "bg-pink-50 text-pink-700 group-hover:bg-pink-600 group-hover:text-white",
        border: "hover:border-pink-500/30 hover:shadow-pink-500/5",
    },
    Marketing: {
        icon: Megaphone,
        bg: "bg-amber-50 text-amber-700 group-hover:bg-amber-600 group-hover:text-white",
        border: "hover:border-amber-500/30 hover:shadow-amber-500/5",
    },
    Writing: {
        icon: PenLine,
        bg: "bg-indigo-50 text-indigo-700 group-hover:bg-indigo-600 group-hover:text-white",
        border: "hover:border-indigo-500/30 hover:shadow-indigo-500/5",
    },
};

function Home() {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [featured, setFeatured] = useState([]);

    useEffect(() => {
        const load = async () => {
            try {
                const { data } = await API.get("/services", {
                    params: { limit: 3, sort: "newest" },
                });
                setFeatured(data.services || []);
            } catch {
                setFeatured([]);
            }
        };

        load();
    }, []);

    const handleSearch = (event) => {
        event.preventDefault();
        const value = query.trim();
        navigate(value ? `/services?search=${encodeURIComponent(value)}` : "/services");
    };

    return (
        <div className="space-y-0 overflow-hidden">
            {/* Hero Section */}
            <section className="relative overflow-hidden border-b border-line/65 dark:border-line bg-white dark:bg-transparent py-20 sm:py-32">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(15,118,110,0.12),_transparent_55%)]" />
                
                {/* Visual grid backing */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000003_1px,transparent_1px),linear-gradient(to_bottom,#00000003_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,white,transparent_80%)]" />

                <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
                    <div className="mx-auto max-w-3xl text-center">
                        <span className="animate-fade-in inline-flex items-center gap-1.5 rounded-full border border-line dark:border-line bg-canvas dark:bg-white/5 px-3.5 py-1 text-xs font-semibold tracking-wider uppercase text-muted dark:text-zinc-300 shadow-sm">
                            <Sparkles size={12} className="text-accent dark:text-teal-400" />
                            Skill marketplace redialed
                        </span>
                        
                        <h1 className="animate-fade-up delay-1 mt-6 font-display text-4xl font-extrabold tracking-tight text-ink dark:text-white sm:text-6xl md:text-7xl leading-[1.05]">
                            Find the right skills.
                            <span className="block mt-2 text-accent dark:text-teal-400">Get work done.</span>
                        </h1>
                        
                        <p className="animate-fade-up delay-2 mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted dark:text-zinc-400 sm:text-lg">
                            Connect with top-tier freelance experts, schedule bookings, and complete projects with a transparent, role-aware workflow designed for execution.
                        </p>

                        {/* Search Bar */}
                        <form
                            onSubmit={handleSearch}
                            className="animate-fade-up delay-3 mx-auto mt-10 flex max-w-xl items-center gap-2 rounded-2xl border border-line/95 dark:border-line bg-white dark:bg-[#11131a] p-2 shadow-md focus-within:ring-4 focus-within:ring-accent/10 focus-within:border-accent transition-all duration-300"
                        >
                            <Search className="ml-3 shrink-0 text-muted/70 dark:text-zinc-400" size={18} />
                            <input
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                                placeholder="Search: React, Logo Design, Copywriting..."
                                className="w-full bg-transparent px-2 py-3 text-sm text-ink dark:text-white outline-none placeholder:text-muted/65 dark:placeholder:text-zinc-500 font-medium"
                                aria-label="Search services"
                            />
                            <button
                                type="submit"
                                className="rounded-xl bg-ink dark:bg-teal-600 px-5 py-3 text-sm font-bold text-white hover:bg-zinc-800 dark:hover:bg-teal-700 shadow-sm transition-all duration-200 active:scale-98 cursor-pointer"
                            >
                                Search
                            </button>
                        </form>

                        {/* CTAs */}
                        <div className="animate-fade-up delay-4 mt-8 flex flex-wrap items-center justify-center gap-3">
                            <Link
                                to="/services"
                                className="inline-flex items-center gap-2 rounded-xl bg-accent dark:bg-teal-600 px-6 py-3.5 text-sm font-bold text-white hover:bg-accent-dark dark:hover:bg-teal-700 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-98"
                            >
                                Explore Services
                                <ArrowRight size={15} />
                            </Link>
                            <Link
                                to="/become-provider"
                                className="inline-flex items-center rounded-xl border border-line dark:border-line bg-white dark:bg-[#11131a] px-6 py-3.5 text-sm font-bold text-ink dark:text-white hover:bg-canvas dark:hover:bg-white/5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-98"
                            >
                                Become a Provider
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Popular Categories */}
            <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
                <div className="mb-10 text-center sm:text-left">
                    <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl text-ink dark:text-white">
                        Popular categories
                    </h2>
                    <p className="mt-2 text-sm text-muted dark:text-zinc-400">
                        Browse top capabilities and book direct listings.
                    </p>
                </div>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {CATEGORIES.map((category) => {
                        const theme = categoryThemes[category.name] || categoryThemes.Development;
                        const Icon = theme.icon;
                        return (
                            <Link
                                key={category.name}
                                to={`/services?category=${encodeURIComponent(category.name)}`}
                                className={`group rounded-2xl border border-line dark:border-line bg-white dark:bg-[#11131a] p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${theme.border}`}
                            >
                                <div className={`flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-300 ${theme.bg}`}>
                                    <Icon size={20} className="stroke-[2.2]" />
                                </div>
                                <h3 className="mt-5 text-lg font-bold text-ink dark:text-white group-hover:text-accent dark:group-hover:text-teal-400 transition-colors duration-150">
                                    {category.name}
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-muted dark:text-zinc-400">
                                    {category.description}
                                </p>
                                <p className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-ink dark:text-zinc-200 group-hover:text-accent dark:group-hover:text-teal-400 transition-all duration-150">
                                    Browse Services
                                    <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                                </p>
                            </Link>
                        );
                    })}
                </div>
            </section>

            {/* How It Works Section */}
            <section className="border-y border-line/65 dark:border-line bg-white dark:bg-[#0d0f15]">
                <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
                    <div className="text-center">
                        <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl text-ink dark:text-white">
                            How SkillBook works
                        </h2>
                        <p className="mt-2 text-sm text-muted dark:text-zinc-400">
                            Three simple steps from booking request to final execution.
                        </p>
                    </div>
                    <div className="mt-12 grid gap-6 md:grid-cols-3">
                        {[
                            {
                                step: "01",
                                title: "Find expert listings",
                                copy: "Search custom developer, writer, marketer, or designer services and evaluate fixed prices.",
                            },
                            {
                                step: "02",
                                title: "Secure booking requests",
                                copy: "Send requests with details directly. Providers approve the order upon validation.",
                            },
                            {
                                step: "03",
                                title: "Track execution",
                                copy: "Collaborate transparently through pending, accepted, and completed stages.",
                            },
                        ].map((item) => (
                            <div key={item.step} className="rounded-2xl border border-line dark:border-line bg-canvas/30 dark:bg-[#12141d] p-8 shadow-sm transition-all hover:bg-white dark:hover:bg-[#161924] hover:shadow-md duration-300">
                                <p className="font-display text-4xl font-extrabold text-accent/30 dark:text-teal-400/40">{item.step}</p>
                                <h3 className="mt-4 text-lg font-bold text-ink dark:text-white">{item.title}</h3>
                                <p className="mt-3 text-sm leading-relaxed text-muted dark:text-zinc-400">{item.copy}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Services Section */}
            {featured.length > 0 && (
                <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
                    <div className="mb-10 flex items-end justify-between gap-4">
                        <div>
                            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl text-ink dark:text-white">
                                Featured services
                            </h2>
                            <p className="mt-2 text-sm text-muted dark:text-zinc-400">
                                Discover fixed-price packages ready to buy now.
                            </p>
                        </div>
                        <Link
                            to="/services"
                            className="inline-flex items-center gap-1 text-sm font-bold text-accent dark:text-teal-400 hover:text-accent-dark dark:hover:text-teal-300 transition-colors"
                        >
                            View all services
                            <ArrowRight size={14} />
                        </Link>
                    </div>
                    
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {featured.map((service) => (
                            <ServiceCard key={service._id} service={service} />
                        ))}
                    </div>
                </section>
            )}

            {/* Why SkillBook Section */}
            <section className="border-t border-line/65 dark:border-line bg-white dark:bg-[#0d0f15]">
                <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
                    <div className="mb-10 text-center md:text-left">
                        <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl text-ink dark:text-white">
                            Why platform quality matters
                        </h2>
                        <p className="mt-2 text-sm text-muted dark:text-zinc-400">
                            Clean designs built around status badges and verified users.
                        </p>
                    </div>
                    <div className="grid gap-6 md:grid-cols-3">
                        {[
                            {
                                icon: ShieldCheck,
                                title: "Structured Role System",
                                copy: "Strict boundary logic guarantees customers order details cleanly, providers list catalogs, and admins authorize access.",
                            },
                            {
                                icon: Clock,
                                title: "Status Tracking Badges",
                                copy: "Monitor bookings from initiation to final checkout. Keep updates verified with clear database checks.",
                            },
                            {
                                icon: Sparkles,
                                title: "High-End UX Standards",
                                copy: "Focus on delivery details, structured forms, search parameters, and typography with zero distraction layout modules.",
                            },
                        ].map((item) => (
                            <div key={item.title} className="rounded-2xl border border-line dark:border-line bg-white dark:bg-[#12141d] p-6 shadow-sm transition-all hover:shadow-md duration-200">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-canvas dark:bg-white/5 text-accent dark:text-teal-400 shadow-inner">
                                    <item.icon size={18} className="stroke-[2.2]" />
                                </div>
                                <h3 className="mt-4 text-base font-bold text-ink dark:text-white">{item.title}</h3>
                                <p className="mt-2 text-sm leading-relaxed text-muted dark:text-zinc-400">{item.copy}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Premium CTA Block */}
            <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
                <div className="relative overflow-hidden rounded-3xl bg-ink dark:bg-[#12151e] border border-transparent dark:border-line px-6 py-16 text-center text-white sm:px-12 shadow-lg">
                    {/* Decorative grid overlay for dark card */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
                    
                    <div className="relative z-10 max-w-2xl mx-auto space-y-5">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent/20 border border-accent/30 text-teal-300">
                            <CheckCircle size={22} className="stroke-[2.5]" />
                        </div>
                        <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl leading-none">
                            Ready to hire or offer services?
                        </h2>
                        <p className="mx-auto max-w-lg text-sm leading-relaxed text-zinc-300 font-medium">
                            Join SkillBook today. Book professional listings directly, or apply to join as an approved marketplace provider.
                        </p>
                        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5">
                            <Link
                                to="/services"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-white text-ink hover:bg-zinc-100 shadow-md transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-98 font-bold text-sm px-6 py-3.5"
                            >
                                Explore Services
                                <ArrowRight size={15} />
                            </Link>
                            <Link
                                to="/become-provider"
                                className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-white/20 px-6 py-3.5 text-sm font-bold text-white hover:bg-white/10 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-98"
                            >
                                Become a Provider
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Home;
