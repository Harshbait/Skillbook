import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Edit2, AlertTriangle, AlertCircle } from "lucide-react";
import API from "../services/api";
import Loading from "../components/Loading";
import { CATEGORIES, isOwnService } from "../utils/constants";
import { useAuth } from "../context/AuthContext";

function EditService() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const load = async () => {
            try {
                const { data } = await API.get(`/services/${id}`);
                const service = data.service;

                if (!isOwnService(service, user)) {
                    setError("You can only edit your own services.");
                    setFormData(null);
                    return;
                }

                setFormData({
                    title: service.title || "",
                    description: service.description || "",
                    category: service.category || "Development",
                    price: service.price ?? "",
                    duration: service.duration || "",
                });
            } catch (err) {
                setError(err.response?.data?.message || "Unable to load service");
            } finally {
                setLoading(false);
            }
        };

        if (user) load();
    }, [id, user]);

    const handleChange = (event) => {
        setFormData((current) => ({
            ...current,
            [event.target.name]: event.target.value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setSuccess("");

        const price = Number(formData.price);
        if (!price || price <= 0) {
            setError("Price must be greater than 0.");
            return;
        }

        const payload = {
            title: formData.title.trim(),
            description: formData.description.trim(),
            category: formData.category,
            price,
            duration: formData.duration.trim(),
        };

        try {
            setSaving(true);

            // Controller supports update; if the route is not mounted, PUT/PATCH may 404.
            try {
                await API.put(`/services/${id}`, payload);
            } catch (firstError) {
                if (firstError.response?.status !== 404) throw firstError;
                await API.patch(`/services/${id}`, payload);
            }

            setSuccess("Service updated successfully.");
            setTimeout(() => navigate("/my-services"), 700);
        } catch (err) {
            const status = err.response?.status;
            if (status === 404) {
                setError(
                    "Service updates are currently restricted by the backend API route configuration. Please delete this service and create a new listing with your changes instead."
                );
            } else {
                setError(err.response?.data?.message || "Unable to update service");
            }
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <Loading label="Loading service details..." />;

    if (!formData) {
        return (
            <div className="mx-auto max-w-xl px-4 py-16 text-center space-y-5 animate-fade-up">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/40">
                    <AlertCircle size={22} />
                </div>
                <h2 className="font-display text-2xl font-bold text-ink dark:text-white">Service Unavailable</h2>
                <p className="text-sm text-muted dark:text-zinc-400">{error || "The service details could not be loaded."}</p>
                <Link
                    to="/my-services"
                    className="inline-flex rounded-xl bg-ink dark:bg-teal-600 px-5 py-3 text-sm font-bold text-white hover:bg-zinc-800 dark:hover:bg-teal-700 transition-all duration-150 active:scale-98"
                >
                    Back to my services
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-[85vh] bg-canvas/15 dark:bg-transparent py-12">
            <div className="mx-auto max-w-2xl px-4 sm:px-6 space-y-6 animate-fade-up">
                {/* Breadcrumbs */}
                <p className="text-xs font-semibold text-muted dark:text-zinc-400">
                    <Link to="/my-services" className="hover:text-ink dark:hover:text-white flex items-center gap-1">
                        <ArrowLeft size={13} className="stroke-[2.5]" />
                        Back to My Services
                    </Link>
                </p>

                {/* Header */}
                <div className="space-y-1">
                    <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink dark:text-white">Edit service</h1>
                    <p className="text-sm text-muted dark:text-zinc-400">
                        Update the title, category, price, and duration parameters of your listing.
                    </p>
                </div>

                {/* API Warning Alert */}
                <div className="rounded-2xl border border-amber-200 dark:border-amber-800/40 bg-amber-50 dark:bg-amber-950/40 p-4.5 text-xs leading-relaxed text-amber-800 dark:text-amber-300 flex gap-3 shadow-inner">
                    <AlertTriangle size={18} className="shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                    <div>
                        <span className="font-bold uppercase tracking-wider block mb-1">Backend Configuration Notice</span>
                        SkillBook's backend router has a duplicate route configuration that locks the update endpoint. If this submission fails with a 404, please delete this service listing and publish a new one with your updated changes.
                    </div>
                </div>

                {/* Form Card */}
                <form
                    onSubmit={handleSubmit}
                    className="rounded-2xl border border-line dark:border-line bg-white dark:bg-[#11131a] p-6 shadow-sm sm:p-8 space-y-5"
                >
                    {error && (
                        <div className="rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/30 p-3.5 text-xs font-semibold text-rose-700 dark:text-rose-400">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-950/30 p-3.5 text-xs font-semibold text-emerald-800 dark:text-emerald-400">
                            {success}
                        </div>
                    )}

                    {/* Title */}
                    <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-ink dark:text-zinc-200" htmlFor="title">
                            Service Title
                        </label>
                        <input
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="mt-2 w-full rounded-xl border border-line dark:border-line bg-canvas/30 dark:bg-white/5 px-4 py-3 text-sm text-ink dark:text-white outline-none focus:ring-4 focus:ring-accent/10 focus:border-accent focus:bg-white dark:focus:bg-[#161922] transition-all duration-200 font-medium"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-ink dark:text-zinc-200" htmlFor="description">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            rows={5}
                            value={formData.description}
                            onChange={handleChange}
                            required
                            className="mt-2 w-full resize-none rounded-xl border border-line dark:border-line bg-canvas/30 dark:bg-white/5 px-4 py-3 text-sm text-ink dark:text-white outline-none focus:ring-4 focus:ring-accent/10 focus:border-accent focus:bg-white dark:focus:bg-[#161922] transition-all duration-200 font-medium"
                        />
                    </div>

                    {/* Category & Price */}
                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-ink dark:text-zinc-200" htmlFor="category">
                                Category
                            </label>
                            <div className="relative mt-2">
                                <select
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full appearance-none rounded-xl border border-line dark:border-line bg-canvas/30 dark:bg-[#161922] px-4 py-3 text-sm text-ink dark:text-white outline-none focus:ring-4 focus:ring-accent/10 focus:border-accent focus:bg-white dark:focus:bg-[#161922] transition-all duration-200 font-semibold cursor-pointer"
                                >
                                    {CATEGORIES.map((item) => (
                                        <option key={item.name} value={item.name}>
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-muted/75 dark:text-zinc-400">
                                    <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-ink dark:text-zinc-200" htmlFor="price">
                                Price (₹)
                            </label>
                            <input
                                id="price"
                                name="price"
                                type="number"
                                min="1"
                                value={formData.price}
                                onChange={handleChange}
                                required
                                className="mt-2 w-full rounded-xl border border-line dark:border-line bg-canvas/30 dark:bg-white/5 px-4 py-3 text-sm text-ink dark:text-white outline-none focus:ring-4 focus:ring-accent/10 focus:border-accent focus:bg-white dark:focus:bg-[#161922] transition-all duration-200 font-medium"
                            />
                        </div>
                    </div>

                    {/* Duration */}
                    <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-ink dark:text-zinc-200" htmlFor="duration">
                            Estimated Duration
                        </label>
                        <input
                            id="duration"
                            name="duration"
                            value={formData.duration}
                            onChange={handleChange}
                            required
                            className="mt-2 w-full rounded-xl border border-line dark:border-line bg-canvas/30 dark:bg-white/5 px-4 py-3 text-sm text-ink dark:text-white outline-none focus:ring-4 focus:ring-accent/10 focus:border-accent focus:bg-white dark:focus:bg-[#161922] transition-all duration-200 font-medium"
                        />
                    </div>

                    {/* Save Button */}
                    <button
                        type="submit"
                        disabled={saving}
                        className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-ink dark:bg-teal-600 py-3.5 text-sm font-bold text-white hover:bg-zinc-800 dark:hover:bg-teal-700 shadow-md transition-all duration-150 active:scale-98 disabled:opacity-50 cursor-pointer"
                    >
                        <Edit2 size={15} className="stroke-[2.5]" />
                        {saving ? "Saving changes..." : "Save listing changes"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default EditService;
