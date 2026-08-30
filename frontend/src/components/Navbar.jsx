import { Link } from "react-router-dom";
import { Search, Menu, User } from "lucide-react";

function Navbar() {
    return (
        <nav className="border-b bg-white">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

                {/* Logo */}
                <Link
                    to="/"
                    className="text-2xl font-bold"
                >
                    SkillBook
                </Link>

                {/* Desktop navigation */}
                <div className="hidden items-center gap-8 md:flex">

                    <Link
                        to="/services"
                        className="text-gray-600 hover:text-black"
                    >
                        Browse Services
                    </Link>

                    <Link
                        to="/register"
                        className="text-gray-600 hover:text-black"
                    >
                        Become a Provider
                    </Link>

                    <Link
                        to="/login"
                        className="flex items-center gap-2 text-gray-600 hover:text-black"
                    >
                        <User size={18} />
                        Login
                    </Link>

                    <Link
                        to="/register"
                        className="rounded-lg bg-black px-5 py-2.5 text-white hover:bg-gray-800"
                    >
                        Register
                    </Link>

                </div>

                {/* Mobile menu button */}
                <button className="md:hidden">
                    <Menu size={24} />
                </button>

            </div>
        </nav>
    );
}

export default Navbar;