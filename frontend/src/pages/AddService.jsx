import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Sparkles, FolderPlus } from "lucide-react";
import API from "../services/api";
import { CATEGORIES } from "../utils/constants";

const emptyForm = {
    title: "",
    description: "",
    category: "Development",
    price: "",
    duration: "",
};

function AddService() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState(emptyForm);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

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

        if (!formData.title.trim() || !formData.description.trim() || !formData.duration.trim()) {
            setError("Title, description, and duration are required.");
            return;
        }

        const price = Number(formData.price);
        if (!price || price <= 0) {
            setError("Price must be greater than 0.");
            return;
        }

        try {
            setLoading(true);
            const response = await API.post("/services", {
                title: formData.title.trim(),
                description: formData.description.trim(),
                category: formData.category,
                price,
                duration: formData.duration.trim(),
            });
            setSuccess(response.data.message || "Service listing created successfully.");
            setTimeout(() => navigate("/my-services"), 700);
        } catch (err) {
            setError(err.response?.data?.message || "Unable to create service");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[85vh] bg-canvas/15 dark:bg-transparent py-10 sm:py-12">
            <div className="mx-auto max-w-2xl px-4 sm:px-6 space-y-6 animate-fade-up">
                {/* Back Link */}
                <p className="text-xs font-semibold text-muted dark:text-zinc-400">
                    <Link to="/provider/dashboard" className="hover:text-ink dark:hover:text-white flex items-center gap-1">
                        <ArrowLeft size={13} className="stroke-[2.5]" />
                        Back to Provider Dashboard
                    </Link>
                </p>

                <div className="space-y-1">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-accent dark:text-teal-400">
                        <Sparkles size={11} className="stroke-[2.5]" />
                        Listing Creation
                    </span>
                    <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink dark:text-white sm:text-4xl">
                        Create a new service listing
                    </h1>
                    <p className="text-sm text-muted dark:text-zinc-400">
                        Publish your fixed-price service package to the SkillBook public marketplace.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="rounded-2xl border border-line dark:border-line bg-white dark:bg-[#11131a] p-6 shadow-md sm:p-8 space-y-6"
                >
                    {error && (
                        <div className="rounded-xl border border-rose-100 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/30 p-4 text-xs font-semibold text-rose-700 dark:text-rose-400">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="rounded-xl border border-emerald-100 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-950/30 p-4 text-xs font-semibold text-emerald-800 dark:text-emerald-400">
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
                            type="text"
                            required
                            placeholder="e.g. Modern React Landing Page with Tailwind"
                            value={formData.title}
                            onChange={handleChange}
                            className="mt-2 w-full rounded-xl border border-line dark:border-line bg-canvas/30 dark:bg-white/5 px-4 py-3 text-sm text-ink dark:text-white outline-none focus:ring-4 focus:ring-accent/10 focus:border-accent focus:bg-white dark:focus:bg-[#161922] transition-all duration-200 placeholder:text-muted/50 dark:placeholder:text-zinc-500 font-medium"
                        />
                    </div>

                    {/* Category Selection */}
                    <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-ink dark:text-zinc-200" htmlFor="category">
                            Category
                        </label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="mt-2 w-full rounded-xl border border-line dark:border-line bg-canvas/30 dark:bg-[#161922] px-4 py-3 text-sm text-ink dark:text-white outline-none focus:ring-4 focus:ring-accent/10 focus:border-accent focus:bg-white dark:focus:bg-[#161922] transition-all duration-200 font-medium cursor-pointer"
                        >
                            {CATEGORIES.map((cat) => (
                                <option key={cat.name} value={cat.name}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Description */}
                    <div>
                        <div className="flex justify-between items-center">
                            <label className="text-xs font-bold uppercase tracking-wider text-ink dark:text-zinc-200" htmlFor="description">
                                Service Scope & Deliverables
                            </label>
                            <span className="text-[11px] text-muted dark:text-zinc-400">Min 20 characters</span>
                        </div>
                        <textarea
                            id="description"
                            name="description"
                            required
                            rows={5}
                            placeholder="Detail what is included, tools used, requirements from customer, and your revision policy..."
                            value={formData.description}
                            onChange={handleChange}
                            className="mt-2 w-full resize-none rounded-xl border border-line dark:border-line bg-canvas/30 dark:bg-white/5 px-4 py-3 text-sm text-ink dark:text-white outline-none focus:ring-4 focus:ring-accent/10 focus:border-accent focus:bg-white dark:focus:bg-[#161922] transition-all duration-200 placeholder:text-muted/50 dark:placeholder:text-zinc-500 font-medium"
                        />
                    </div>

                    {/* Price and Duration Row */}
                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-ink dark:text-zinc-200" htmlFor="price">
                                Package Price (INR ₹)
                            </label>
                            <div className="relative mt-2">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-muted dark:text-zinc-400">
                                    ₹
                                </span>
                                <input
                                    id="price"
                                    name="price"
                                    type="number"
                                    min="1"
                                    step="1"
                                    required
                                    placeholder="499"
                                    value={formData.price}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-line dark:border-line bg-canvas/30 dark:bg-white/5 pl-9 pr-4 py-3 text-sm text-ink dark:text-white outline-none focus:ring-4 focus:ring-accent/10 focus:border-accent focus:bg-white dark:focus:bg-[#161922] transition-all duration-200 placeholder:text-muted/50 dark:placeholder:text-zinc-500 font-medium"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-ink dark:text-zinc-200" htmlFor="duration">
                                Estimated Delivery Time
                            </label>
                            <input
                                id="duration"
                                name="duration"
                                type="text"
                                required
                                placeholder="e.g. 2-3 business days"
                                value={formData.duration}
                                onChange={handleChange}
                                className="mt-2 w-full rounded-xl border border-line dark:border-line bg-canvas/30 dark:bg-white/5 px-4 py-3 text-sm text-ink dark:text-white outline-none focus:ring-4 focus:ring-accent/10 focus:border-accent focus:bg-white dark:focus:bg-[#161922] transition-all duration-200 placeholder:text-muted/50 dark:placeholder:text-zinc-500 font-medium"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-ink dark:bg-teal-600 py-3.5 text-sm font-bold text-white hover:bg-zinc-800 dark:hover:bg-teal-700 shadow-md transition-all duration-150 active:scale-98 disabled:opacity-50 cursor-pointer"
                    >
                        <FolderPlus size={16} className="stroke-[2.5]" />
                        {loading ? "Publishing listing..." : "Publish service listing"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AddService;
