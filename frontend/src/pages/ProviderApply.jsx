import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ArrowLeft, Send, Sparkles, Info } from "lucide-react";
import API from "../services/api";

const STEPS = [
    { n: "01", title: "Submit application", copy: "Tell us about your professional skills, bio details, and background." },
    { n: "02", title: "Admin profile review", copy: "A SkillBook administrator evaluates your request for approval." },
    { n: "03", title: "Verify verification status", copy: "Once approved, your account role upgrades to provider automatically." },
    { n: "04", title: "Offer services catalog", copy: "Create detailed listings and start receiving direct bookings." },
];

function ProviderApply() {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();
    const [formData, setFormData] = useState({
        skills: "",
        bio: "",
        experience: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

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

        if (!isAuthenticated) {
            navigate("/login");
            return;
        }

        if (user?.role !== "customer") {
            setError("Only customers can apply to become providers.");
            return;
        }

        const skills = formData.skills
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean);

        if (!skills.length) {
            setError("Add at least one skill.");
            return;
        }

        if (!formData.bio.trim()) {
            setError("Bio is required.");
            return;
        }

        try {
            setLoading(true);
            const response = await API.post("/providers/apply", {
                skills,
                bio: formData.bio.trim(),
                experience: Number(formData.experience),
            });
            setSuccess(response.data.message || "Application submitted successfully.");
            setTimeout(() => navigate("/dashboard"), 900);
        } catch (err) {
            setError(err.response?.data?.message || "Unable to submit application");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[85vh] bg-canvas/15 dark:bg-transparent py-12">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 space-y-8 animate-fade-up">
                {/* Back Link */}
                <p className="text-xs font-semibold text-muted dark:text-zinc-400">
                    <Link to="/" className="hover:text-ink dark:hover:text-white flex items-center gap-1">
                        <ArrowLeft size={13} className="stroke-[2.5]" />
                        Back to Home
                    </Link>
                </p>

                <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
                    {/* Onboarding steps details */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-accent dark:text-teal-400">
                                <Sparkles size={11} className="stroke-[2.5]" />
                                Career Acceleration
                            </span>
                            <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink dark:text-white sm:text-4xl">
                                Become a SkillBook provider
                            </h1>
                            <p className="text-sm leading-relaxed text-muted dark:text-zinc-400 max-w-lg">
                                Offer fixed-price packages to our community. Submit your portfolio details below to get approved by a system administrator.
                            </p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            {STEPS.map((step) => (
                                <div key={step.n} className="rounded-2xl border border-line/60 dark:border-line bg-white dark:bg-[#11131a] p-5 shadow-sm space-y-1.5">
                                    <span className="text-xs font-bold uppercase tracking-wider text-accent dark:text-teal-400">Step {step.n}</span>
                                    <h3 className="font-bold text-ink dark:text-white text-sm">{step.title}</h3>
                                    <p className="text-xs leading-relaxed text-muted dark:text-zinc-400">{step.copy}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Submit application Form Container */}
                    <div className="space-y-4">
                        <form
                            onSubmit={handleSubmit}
                            className="rounded-2xl border border-line dark:border-line bg-white dark:bg-[#11131a] p-6 shadow-sm sm:p-8 space-y-5"
                        >
                            {error && (
                                <div className="rounded-xl border border-rose-100 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/30 p-3.5 text-xs font-semibold text-rose-700 dark:text-rose-400">
                                    {error}
                                </div>
                            )}
                            {success && (
                                <div className="rounded-xl border border-emerald-100 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-950/30 p-3.5 text-xs font-semibold text-emerald-800 dark:text-emerald-400">
                                    {success}
                                </div>
                            )}

                            {!isAuthenticated && (
                                <div className="rounded-xl border border-line/70 dark:border-line bg-canvas dark:bg-white/5 p-3.5 text-xs font-medium text-muted dark:text-zinc-400 flex gap-2 items-start">
                                    <Info size={16} className="shrink-0 text-muted/80 dark:text-zinc-400 mt-0.5" />
                                    <p>
                                        You must have an account first.{" "}
                                        <Link to="/login" className="font-bold text-ink dark:text-teal-400 underline">
                                            Login
                                        </Link>{" "}
                                        or{" "}
                                        <Link to="/register" className="font-bold text-ink dark:text-teal-400 underline">
                                            Register
                                        </Link>{" "}
                                        to continue.
                                    </p>
                                </div>
                            )}

                            {/* Skills input */}
                            <div>
                                <label className="text-xs font-bold uppercase tracking-wider text-ink dark:text-zinc-200" htmlFor="skills">
                                    Skills / Expertise Tags
                                </label>
                                <input
                                    id="skills"
                                    name="skills"
                                    type="text"
                                    value={formData.skills}
                                    onChange={handleChange}
                                    placeholder="React, copywriting, graphic design, SEO"
                                    required
                                    className="mt-2 w-full rounded-xl border border-line dark:border-line bg-canvas/30 dark:bg-white/5 px-4 py-3 text-sm text-ink dark:text-white outline-none focus:ring-4 focus:ring-accent/10 focus:border-accent focus:bg-white dark:focus:bg-[#161922] transition-all duration-200 placeholder:text-muted/50 dark:placeholder:text-zinc-500 font-medium"
                                />
                                <p className="mt-1.5 text-[10px] font-semibold text-muted/70 dark:text-zinc-500">
                                    Separate individual items using commas.
                                </p>
                            </div>

                            {/* Experience input */}
                            <div>
                                <label className="text-xs font-bold uppercase tracking-wider text-ink dark:text-zinc-200" htmlFor="experience">
                                    Years of Professional Experience
                                </label>
                                <input
                                    id="experience"
                                    type="number"
                                    name="experience"
                                    min="0"
                                    value={formData.experience}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g. 3"
                                    className="mt-2 w-full rounded-xl border border-line dark:border-line bg-canvas/30 dark:bg-white/5 px-4 py-3 text-sm text-ink dark:text-white outline-none focus:ring-4 focus:ring-accent/10 focus:border-accent focus:bg-white dark:focus:bg-[#161922] transition-all duration-200 placeholder:text-muted/50 dark:placeholder:text-zinc-500 font-medium"
                                />
                            </div>

                            {/* Bio details */}
                            <div>
                                <label className="text-xs font-bold uppercase tracking-wider text-ink dark:text-zinc-200" htmlFor="bio">
                                    Provider Biography
                                </label>
                                <textarea
                                    id="bio"
                                    name="bio"
                                    rows={5}
                                    maxLength={500}
                                    value={formData.bio}
                                    onChange={handleChange}
                                    required
                                    placeholder="Briefly state your background, professional experiences, past work, and delivery guarantees..."
                                    className="mt-2 w-full resize-none rounded-xl border border-line dark:border-line bg-canvas/30 dark:bg-white/5 px-4 py-3 text-sm text-ink dark:text-white outline-none focus:ring-4 focus:ring-accent/10 focus:border-accent focus:bg-white dark:focus:bg-[#161922] transition-all duration-200 placeholder:text-muted/50 dark:placeholder:text-zinc-500 font-medium"
                                />
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-ink dark:bg-teal-600 py-3.5 text-sm font-bold text-white hover:bg-zinc-800 dark:hover:bg-teal-700 shadow-md transition-all duration-150 active:scale-98 disabled:opacity-50 cursor-pointer"
                            >
                                <Send size={14} className="stroke-[2.5]" />
                                {loading ? "Submitting profile..." : "Submit Application"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProviderApply;
