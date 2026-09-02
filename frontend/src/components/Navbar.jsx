import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, BookOpen, Sun, Moon } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

function Navbar() {
    const { isAuthenticated, user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [open, setOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const role = user?.role;

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [open]);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const linkClass = ({ isActive }) =>
        `rounded-xl px-3.5 py-2 text-sm font-semibold transition-all duration-200 ${
            isActive
                ? "bg-canvas dark:bg-white/10 text-ink dark:text-white"
                : "text-muted hover:bg-canvas/55 dark:hover:bg-white/5 hover:text-ink dark:hover:text-white"
        }`;

    const links = [];

    if (role !== "admin") {
        links.push({ to: "/", label: "Home" });
        links.push({ to: "/services", label: "Services" });
    }

    if (!isAuthenticated) {
        links.push({ to: "/become-provider", label: "Become a Provider" });
    } else if (role === "customer") {
        links.push({ to: "/dashboard", label: "My Dashboard" });
        links.push({ to: "/become-provider", label: "Become a Provider" });
    } else if (role === "provider") {
        links.push({ to: "/provider-dashboard", label: "Dashboard" });
        links.push({ to: "/my-services", label: "My Services" });
    } else if (role === "admin") {
        links.push({ to: "/admin-dashboard", label: "Admin Dashboard" });
    }

    return (
        <header className="sticky top-0 z-40 border-b border-line/65 dark:border-line bg-white/80 dark:bg-[#0f1117]/85 backdrop-blur-md transition-all duration-200">
            <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
                <Link to="/" className="flex items-center gap-2.5 group">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink dark:bg-teal-600 text-sm font-bold text-white transition-transform duration-300 group-hover:rotate-6 shadow-sm">
                        <BookOpen size={17} className="stroke-[2.5]" />
                    </span>
                    <span className="font-display text-xl font-bold tracking-tight text-ink dark:text-white">
                        SkillBook
                    </span>
                </Link>

                <div className="hidden items-center gap-1.5 lg:flex">
                    {links.map((item) => (
                        <NavLink
                            key={item.to + item.label}
                            to={item.to}
                            className={linkClass}
                            end={item.to === "/"}
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </div>

                <div className="hidden items-center gap-3 lg:flex">
                    {/* Dark Mode Toggle Button */}
                    <button
                        type="button"
                        onClick={toggleTheme}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-line dark:border-line bg-white dark:bg-white/5 text-ink dark:text-zinc-200 hover:bg-canvas dark:hover:bg-white/10 transition-all cursor-pointer shadow-sm active:scale-95"
                        aria-label={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
                        title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    >
                        {theme === "dark" ? (
                            <Sun size={17} className="text-amber-400 stroke-[2.2] animate-fade-in" />
                        ) : (
                            <Moon size={17} className="text-zinc-700 stroke-[2.2] animate-fade-in" />
                        )}
                    </button>

                    {isAuthenticated ? (
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full border border-line dark:border-line bg-canvas dark:bg-white/5 uppercase tracking-wider text-muted dark:text-zinc-300">
                                {role}
                            </span>
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="inline-flex items-center gap-2 rounded-xl border border-line dark:border-line px-3.5 py-2 text-sm font-semibold text-ink dark:text-zinc-200 hover:bg-canvas dark:hover:bg-white/10 shadow-sm active:scale-98 cursor-pointer"
                            >
                                <LogOut size={15} />
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2.5">
                            <Link
                                to="/login"
                                className="rounded-xl px-4 py-2 text-sm font-semibold text-muted dark:text-zinc-300 hover:text-ink dark:hover:text-white transition-colors"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="rounded-xl bg-ink dark:bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 dark:hover:bg-teal-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-98"
                            >
                                Register
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Header Actions */}
                <div className="flex items-center gap-2 lg:hidden">
                    <button
                        type="button"
                        onClick={toggleTheme}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-line dark:border-line bg-white dark:bg-white/5 text-ink dark:text-zinc-200 hover:bg-canvas dark:hover:bg-white/10 transition-colors cursor-pointer"
                        aria-label={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    >
                        {theme === "dark" ? (
                            <Sun size={16} className="text-amber-400 stroke-[2.2]" />
                        ) : (
                            <Moon size={16} className="text-zinc-700 stroke-[2.2]" />
                        )}
                    </button>

                    <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-xl border border-line dark:border-line p-2 text-ink dark:text-zinc-200 hover:bg-canvas dark:hover:bg-white/10 transition-colors cursor-pointer"
                        aria-expanded={open}
                        aria-controls="mobile-menu"
                        aria-label={open ? "Close menu" : "Open menu"}
                        onClick={() => setOpen((value) => !value)}
                    >
                        {open ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </nav>

            <div
                id="mobile-menu"
                className={`overflow-hidden border-t border-line/65 dark:border-line bg-white dark:bg-[#0f1117] transition-all duration-300 ease-in-out lg:hidden ${
                    open ? "max-h-[32rem] opacity-100" : "max-h-0 border-t-0 opacity-0"
                }`}
            >
                <div className="flex flex-col gap-1.5 px-4 py-4">
                    {links.map((item) => (
                        <NavLink
                            key={`m-${item.to}-${item.label}`}
                            to={item.to}
                            className={linkClass}
                            end={item.to === "/"}
                        >
                            {item.label}
                        </NavLink>
                    ))}

                    <div className="mt-4 flex flex-col gap-2 border-t border-line/60 dark:border-line pt-4">
                        {isAuthenticated ? (
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center justify-between px-3.5 py-1">
                                    <span className="text-xs font-semibold text-muted dark:text-zinc-400 uppercase tracking-wider">
                                        Account Role
                                    </span>
                                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full border border-line dark:border-line bg-canvas dark:bg-white/5 uppercase tracking-wider text-muted dark:text-zinc-300">
                                        {role}
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="rounded-xl border border-line dark:border-line px-4 py-2.5 text-center text-sm font-semibold text-ink dark:text-zinc-200 hover:bg-canvas dark:hover:bg-white/10 shadow-sm active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <LogOut size={15} />
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                <Link
                                    to="/login"
                                    className="rounded-xl border border-line dark:border-line px-4 py-2.5 text-center text-sm font-semibold text-ink dark:text-zinc-200 hover:bg-canvas dark:hover:bg-white/10"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="rounded-xl bg-ink dark:bg-teal-600 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-zinc-800 dark:hover:bg-teal-700 shadow-sm"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Navbar;
