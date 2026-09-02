import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
    Search,
    Briefcase,
    ArrowUpDown,
    SlidersHorizontal,
    X,
    RotateCcw,
} from "lucide-react";
import API from "../services/api";
import ServiceCard from "../components/ServiceCard";
import EmptyState from "../components/EmptyState";
import { SkeletonGrid } from "../components/Loading";
import useDebouncedValue from "../hooks/useDebouncedValue";
import { CATEGORIES } from "../utils/constants";

function Services() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [services, setServices] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [category, setCategory] = useState(searchParams.get("category") || "");
    const [sort, setSort] = useState(searchParams.get("sort") || "newest");
    const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
    const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
    const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
    const [showFilters, setShowFilters] = useState(false);

    const debouncedSearch = useDebouncedValue(search, 350);
    const debouncedMinPrice = useDebouncedValue(minPrice, 400);
    const debouncedMaxPrice = useDebouncedValue(maxPrice, 400);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSearch(searchParams.get("search") || "");
        setCategory(searchParams.get("category") || "");
        setSort(searchParams.get("sort") || "newest");
        setMinPrice(searchParams.get("minPrice") || "");
        setMaxPrice(searchParams.get("maxPrice") || "");
        setPage(Number(searchParams.get("page")) || 1);
    }, [searchParams]);

    useEffect(() => {
        const params = {};
        if (debouncedSearch) params.search = debouncedSearch;
        if (category) params.category = category;
        if (sort && sort !== "newest") params.sort = sort;
        if (debouncedMinPrice) params.minPrice = debouncedMinPrice;
        if (debouncedMaxPrice) params.maxPrice = debouncedMaxPrice;
        if (page > 1) params.page = String(page);
        setSearchParams(params, { replace: true });
    }, [
        debouncedSearch,
        category,
        sort,
        debouncedMinPrice,
        debouncedMaxPrice,
        page,
        setSearchParams,
    ]);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await API.get("/services", {
                    params: {
                        search: debouncedSearch || undefined,
                        category: category || undefined,
                        sort: sort || undefined,
                        minPrice: debouncedMinPrice ? Number(debouncedMinPrice) : undefined,
                        maxPrice: debouncedMaxPrice ? Number(debouncedMaxPrice) : undefined,
                        page,
                        limit: 12,
                    },
                });

                setServices(response.data.services || []);
                setPagination(response.data.pagination || null);
            } catch (err) {
                setError(err.response?.data?.message || "Unable to load services");
                setServices([]);
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, [debouncedSearch, category, sort, debouncedMinPrice, debouncedMaxPrice, page]);

    const hasActiveFilters = Boolean(
        search || category || (sort && sort !== "newest") || minPrice || maxPrice
    );

    const resetFilters = () => {
        setSearch("");
        setCategory("");
        setSort("newest");
        setMinPrice("");
        setMaxPrice("");
        setPage(1);
    };

    return (
        <div className="min-h-[80vh] bg-canvas/15 dark:bg-transparent pb-16">
            {/* Header Section */}
            <section className="border-b border-line/65 dark:border-line bg-white dark:bg-transparent py-12 sm:py-14">
                <div className="mx-auto max-w-6xl px-4 sm:px-6">
                    <div className="max-w-2xl space-y-1">
                        <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink dark:text-white sm:text-4xl">
                            Explore Services
                        </h1>
                        <p className="text-sm text-muted dark:text-zinc-400">
                            Search freelance listings, sort by budget, and book verified service providers.
                        </p>
                    </div>

                    {/* Search & Main Filter Controls */}
                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        {/* Search Bar */}
                        <div className="flex flex-1 items-center rounded-2xl border border-line dark:border-line bg-canvas/40 dark:bg-[#11131a] px-4 shadow-inner focus-within:ring-4 focus-within:ring-accent/10 focus-within:border-accent focus-within:bg-white dark:focus-within:bg-[#161922] transition-all duration-200">
                            <Search size={18} className="text-muted/65 dark:text-zinc-400 shrink-0" />
                            <input
                                type="search"
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(1);
                                }}
                                placeholder="Search by skill, title, or keywords (e.g. React, Logo, SEO)..."
                                className="w-full bg-transparent px-3 py-3.5 text-sm text-ink dark:text-white outline-none font-medium placeholder:text-muted/60 dark:placeholder:text-zinc-500"
                            />
                            {search && (
                                <button
                                    type="button"
                                    onClick={() => setSearch("")}
                                    className="text-muted dark:text-zinc-400 hover:text-ink dark:hover:text-white p-1 cursor-pointer"
                                    aria-label="Clear search"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>

                        {/* Sort Dropdown */}
                        <div className="relative flex items-center shrink-0">
                            <ArrowUpDown size={15} className="absolute left-3.5 text-muted/70 dark:text-zinc-400 pointer-events-none" />
                            <select
                                value={sort}
                                onChange={(e) => {
                                    setSort(e.target.value);
                                    setPage(1);
                                }}
                                className="w-full sm:w-auto appearance-none rounded-2xl border border-line dark:border-line bg-white dark:bg-[#11131a] pl-9 pr-9 py-3.5 text-xs font-bold text-ink dark:text-zinc-200 outline-none focus:ring-4 focus:ring-accent/10 focus:border-accent transition-all duration-200 cursor-pointer shadow-sm"
                                aria-label="Sort services"
                            >
                                <option value="newest">Newest First</option>
                                <option value="price_asc">Price: Low to High</option>
                                <option value="price_desc">Price: High to Low</option>
                                <option value="oldest">Oldest First</option>
                            </select>
                            <div className="absolute right-3.5 pointer-events-none text-muted/70 dark:text-zinc-400">
                                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 20 20">
                                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                </svg>
                            </div>
                        </div>

                        {/* Toggle More Filters Button */}
                        <button
                            type="button"
                            onClick={() => setShowFilters((v) => !v)}
                            className={`inline-flex items-center justify-center gap-1.5 rounded-2xl border px-4 py-3.5 text-xs font-bold transition-all cursor-pointer shadow-sm ${
                                showFilters || minPrice || maxPrice
                                    ? "bg-ink dark:bg-teal-600 text-white border-ink dark:border-teal-600"
                                    : "bg-white dark:bg-[#11131a] text-ink dark:text-zinc-200 border-line dark:border-line hover:bg-canvas dark:hover:bg-white/5"
                            }`}
                        >
                            <SlidersHorizontal size={14} />
                            Filters {(minPrice || maxPrice) && "•"}
                        </button>
                    </div>

                    {/* Category Filter Chips */}
                    <div className="mt-5 flex flex-wrap items-center gap-2">
                        <button
                            type="button"
                            onClick={() => {
                                setCategory("");
                                setPage(1);
                            }}
                            className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                                !category
                                    ? "bg-accent dark:bg-teal-600 text-white shadow-sm"
                                    : "bg-canvas dark:bg-white/5 text-muted dark:text-zinc-400 hover:bg-canvas/80 dark:hover:bg-white/10 hover:text-ink dark:hover:text-white border border-line/60 dark:border-line"
                            }`}
                        >
                            All Categories
                        </button>
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat.name}
                                type="button"
                                onClick={() => {
                                    setCategory(cat.name);
                                    setPage(1);
                                }}
                                className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                                    category === cat.name
                                        ? "bg-accent dark:bg-teal-600 text-white shadow-sm"
                                        : "bg-canvas dark:bg-white/5 text-muted dark:text-zinc-400 hover:bg-canvas/80 dark:hover:bg-white/10 hover:text-ink dark:hover:text-white border border-line/60 dark:border-line"
                                }`}
                            >
                                {cat.name}
                            </button>
                        ))}

                        {hasActiveFilters && (
                            <button
                                type="button"
                                onClick={resetFilters}
                                className="inline-flex items-center gap-1 ml-auto text-xs font-bold text-rose-600 dark:text-rose-400 hover:text-rose-700 py-1.5 px-2.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                            >
                                <RotateCcw size={12} />
                                Reset Filters
                            </button>
                        )}
                    </div>

                    {/* Expandable Price Range Filter Drawer */}
                    {showFilters && (
                        <div className="mt-4 rounded-2xl border border-line/80 dark:border-line bg-canvas/30 dark:bg-[#11131a] p-4 sm:p-5 flex flex-wrap items-center gap-4 animate-fade-in">
                            <span className="text-xs font-bold uppercase tracking-wider text-ink dark:text-zinc-200">
                                Price Range (₹)
                            </span>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    min="0"
                                    placeholder="Min ₹"
                                    value={minPrice}
                                    onChange={(e) => {
                                        setMinPrice(e.target.value);
                                        setPage(1);
                                    }}
                                    className="w-28 rounded-xl border border-line dark:border-line bg-white dark:bg-[#161922] px-3 py-2 text-xs font-medium text-ink dark:text-white outline-none focus:border-accent"
                                />
                                <span className="text-xs text-muted dark:text-zinc-400 font-bold">to</span>
                                <input
                                    type="number"
                                    min="0"
                                    placeholder="Max ₹"
                                    value={maxPrice}
                                    onChange={(e) => {
                                        setMaxPrice(e.target.value);
                                        setPage(1);
                                    }}
                                    className="w-28 rounded-xl border border-line dark:border-line bg-white dark:bg-[#161922] px-3 py-2 text-xs font-medium text-ink dark:text-white outline-none focus:border-accent"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Grid Container */}
            <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
                {loading && (
                    <div className="space-y-6">
                        <div className="h-4 w-32 animate-pulse rounded bg-stone-200 dark:bg-white/10" />
                        <SkeletonGrid count={6} />
                    </div>
                )}

                {!loading && error && (
                    <div className="rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40 p-6 text-rose-700 dark:text-rose-400 font-semibold shadow-sm" role="alert">
                        {error}
                    </div>
                )}

                {!loading && !error && services.length === 0 && (
                    <div className="py-8">
                        <EmptyState
                            icon={Briefcase}
                            title="No services match your criteria"
                            description="Try clearing filters, changing keywords, or selecting another category."
                            action={
                                hasActiveFilters ? (
                                    <button
                                        type="button"
                                        onClick={resetFilters}
                                        className="inline-flex rounded-xl bg-ink dark:bg-teal-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-zinc-800 dark:hover:bg-teal-700 transition-all cursor-pointer"
                                    >
                                        Clear all filters
                                    </button>
                                ) : null
                            }
                        />
                    </div>
                )}

                {!loading && !error && services.length > 0 && (
                    <>
                        <div className="mb-6 flex items-center justify-between">
                            <p className="text-xs font-bold uppercase tracking-wider text-muted dark:text-zinc-400">
                                {pagination?.totalServices ?? services.length} service
                                {services.length === 1 ? "" : "s"} available
                            </p>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {services.map((service) => (
                                <ServiceCard key={service._id} service={service} />
                            ))}
                        </div>

                        {/* Pagination controls */}
                        {pagination && pagination.totalPages > 1 && (
                            <div className="mt-12 flex items-center justify-center gap-3 border-t border-line/60 dark:border-line pt-8">
                                <button
                                    type="button"
                                    disabled={page <= 1}
                                    onClick={() => setPage((current) => current - 1)}
                                    className="rounded-xl border border-line dark:border-line bg-white dark:bg-[#11131a] px-4 py-2.5 text-xs font-bold text-ink dark:text-zinc-200 hover:bg-canvas dark:hover:bg-white/5 shadow-sm active:scale-98 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer"
                                >
                                    Previous
                                </button>
                                <span className="text-xs font-bold text-muted dark:text-zinc-400 px-3 py-1.5 rounded-xl bg-canvas dark:bg-white/5 border border-line/50 dark:border-line">
                                    Page {pagination.currentPage} of {pagination.totalPages}
                                </span>
                                <button
                                    type="button"
                                    disabled={page >= pagination.totalPages}
                                    onClick={() => setPage((current) => current + 1)}
                                    className="rounded-xl border border-line dark:border-line bg-white dark:bg-[#11131a] px-4 py-2.5 text-xs font-bold text-ink dark:text-zinc-200 hover:bg-canvas dark:hover:bg-white/5 shadow-sm active:scale-98 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}

export default Services;
