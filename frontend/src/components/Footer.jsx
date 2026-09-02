import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";

function Footer() {
    return (
        <footer className="border-t border-line/65 dark:border-line bg-white dark:bg-[#0c0d12] transition-all duration-200">
            <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-4">
                <div className="md:col-span-2">
                    <div className="flex items-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-ink dark:bg-teal-600 text-white shadow-sm">
                            <BookOpen size={15} className="stroke-[2.5]" />
                        </span>
                        <span className="font-display text-xl font-bold tracking-tight text-ink dark:text-white">
                            SkillBook
                        </span>
                    </div>
                    <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted dark:text-zinc-400">
                        A curated marketplace for skilled professionals. Find the right person,
                        book with confidence, and get real work done with no platform clutter.
                    </p>
                </div>

                <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-ink dark:text-white">Explore</h4>
                    <div className="mt-4 flex flex-col gap-2.5 text-sm font-medium text-muted dark:text-zinc-400">
                        <Link to="/services" className="hover:text-ink dark:hover:text-white transition-colors duration-150">Browse Services</Link>
                        <Link to="/become-provider" className="hover:text-ink dark:hover:text-white transition-colors duration-150">Become a Provider</Link>
                        <Link to="/register" className="hover:text-ink dark:hover:text-white transition-colors duration-150">Register Account</Link>
                    </div>
                </div>

                <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-ink dark:text-white">Portal</h4>
                    <div className="mt-4 flex flex-col gap-2.5 text-sm font-medium text-muted dark:text-zinc-400">
                        <Link to="/login" className="hover:text-ink dark:hover:text-white transition-colors duration-150">Sign In</Link>
                        <Link to="/dashboard" className="hover:text-ink dark:hover:text-white transition-colors duration-150">My Workspace</Link>
                    </div>
                </div>
            </div>

            <div className="border-t border-line/55 dark:border-line bg-canvas/30 dark:bg-black/20">
                <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs font-medium text-muted dark:text-zinc-400">
                        © {new Date().getFullYear()} SkillBook Marketplace. All rights reserved.
                    </p>
                    <p className="text-xs font-medium text-muted/70 dark:text-zinc-500">
                        Crafted for quality delivery and professional execution.
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
