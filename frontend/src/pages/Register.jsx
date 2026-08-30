import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";

import API from "../services/api";

function Register() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "customer"
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setLoading(true);

        try {

            await API.post(
                "/users/register",
                formData
            );

            navigate("/login");

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Registration failed"
            );

        } finally {

            setLoading(false);

        }
    };


    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6">

            <div className="w-full max-w-md">

                {/* Header */}
                <div className="mb-8 text-center">

                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-black text-white">
                        <UserPlus size={22} />
                    </div>

                    <h1 className="mt-5 text-3xl font-bold">
                        Create your account
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Join SkillBook today
                    </p>

                </div>


                <form
                    onSubmit={handleSubmit}
                    className="rounded-2xl border bg-white p-8 shadow-sm"
                >

                    {error && (
                        <div className="mb-5 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}


                    {/* Name */}
                    <div>

                        <label className="text-sm font-medium">
                            Full Name
                        </label>

                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            required
                            className="mt-2 w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
                        />

                    </div>


                    {/* Email */}
                    <div className="mt-5">

                        <label className="text-sm font-medium">
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            required
                            className="mt-2 w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
                        />

                    </div>


                    {/* Password */}
                    <div className="mt-5">

                        <label className="text-sm font-medium">
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            required
                            className="mt-2 w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
                        />

                    </div>


                    {/* Role */}
                    <div className="mt-5">

                        <label className="text-sm font-medium">
                            I want to
                        </label>

                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="mt-2 w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
                        >

                            <option value="customer">
                                Hire a professional
                            </option>

                            <option value="provider">
                                Offer my services
                            </option>

                        </select>

                    </div>


                    {/* Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-6 w-full rounded-lg bg-black py-3 font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
                    >
                        {loading
                            ? "Creating account..."
                            : "Create Account"
                        }
                    </button>


                    <p className="mt-6 text-center text-sm text-gray-500">

                        Already have an account?{" "}

                        <Link
                            to="/login"
                            className="font-semibold text-black"
                        >
                            Login
                        </Link>

                    </p>

                </form>

            </div>

        </div>
    );
}

export default Register;