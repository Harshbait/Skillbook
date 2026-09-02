import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, LogIn, BookOpen } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import { dashboardPath } from "../utils/constants";

function Login() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { login, isAuthenticated, user, ready } = useAuth();

    const [formData, setFormData] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(
        searchParams.get("registered") === "1"
            ? "Account created successfully. You can sign in now."
            : ""
    );
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (ready && isAuthenticated) {
            navigate(dashboardPath(user?.role), { replace: true });
        }
    }, [ready, isAuthenticated, user, navigate]);

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

        if (!formData.email.trim() || !formData.password) {
            setError("Email and password are required.");
            return;
        }

        setLoading(true);

        try {
            const response = await API.post("/users/login", formData);
            const token = response.data.token;
            login(token);

            const decoded = jwtDecode(token);
            navigate(dashboardPath(decoded.role));
        } catch (err) {
            setError(err.response?.data?.message || "Invalid credentials. Please check your email or password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-canvas/15 dark:bg-transparent px-4 py-12 sm:px-6">
            <div className="w-full max-w-md space-y-6 animate-fade-up">
                <div className="text-center space-y-2">
                    <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-ink dark:bg-teal-600 text-white shadow-sm">
                        <BookOpen size={20} className="stroke-[2.5]" />
                    </div>
                    <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink dark:text-white">Welcome back</h1>
                    <p className="text-sm text-muted dark:text-zinc-400">Sign in to your SkillBook marketplace workspace.</p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="rounded-2xl border border-line dark:border-line bg-white dark:bg-[#11131a] p-6 shadow-md sm:p-8 space-y-5"
                    noValidate
                >
                    {success && (
                        <div className="rounded-xl border border-emerald-100 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-950/30 p-3.5 text-xs font-semibold text-emerald-800 dark:text-emerald-400">
                            {success}
                        </div>
                    )}
                    {error && (
                        <div className="rounded-xl border border-rose-100 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/30 p-3.5 text-xs font-semibold text-rose-700 dark:text-rose-400" role="alert">
                            {error}
                        </div>
                    )}

                    {/* Email Input */}
                    <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-ink dark:text-zinc-200" htmlFor="email">
                            Email address
                        </label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            autoComplete="email"
                            required
                            placeholder="name@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            className="mt-2 w-full rounded-xl border border-line dark:border-line bg-canvas/30 dark:bg-white/5 px-4 py-3 text-sm text-ink dark:text-white outline-none focus:ring-4 focus:ring-accent/10 focus:border-accent focus:bg-white dark:focus:bg-[#161922] transition-all duration-200 placeholder:text-muted/50 dark:placeholder:text-zinc-500 font-medium"
                        />
                    </div>

                    {/* Password Input */}
                    <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-ink dark:text-zinc-200" htmlFor="password">
                            Password
                        </label>
                        <div className="relative mt-2">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                autoComplete="current-password"
                                required
                                placeholder="Enter password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-line dark:border-line bg-canvas/30 dark:bg-white/5 px-4 py-3 pr-12 text-sm text-ink dark:text-white outline-none focus:ring-4 focus:ring-accent/10 focus:border-accent focus:bg-white dark:focus:bg-[#161922] transition-all duration-200 placeholder:text-muted/50 dark:placeholder:text-zinc-500 font-medium"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((value) => !value)}
                                className="absolute inset-y-0 right-0 px-3.5 flex items-center text-muted dark:text-zinc-400 hover:text-ink dark:hover:text-white transition-colors cursor-pointer"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-ink dark:bg-teal-600 py-3.5 text-sm font-bold text-white hover:bg-zinc-800 dark:hover:bg-teal-700 shadow-md transition-all duration-150 active:scale-98 disabled:opacity-50 cursor-pointer"
                    >
                        <LogIn size={15} />
                        {loading ? "Verifying credentials..." : "Sign in to account"}
                    </button>

                    <div className="border-t border-line/60 dark:border-line pt-5 text-center text-sm font-medium text-muted dark:text-zinc-400">
                        Don&apos;t have an account?{" "}
                        <Link to="/register" className="font-bold text-ink dark:text-teal-400 underline">
                            Create customer account
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
