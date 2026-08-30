import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import { useAuth } from "../context/AuthContext";

import API from "../services/api";

function Login() {
    
    const navigate = useNavigate();
    const { login } = useAuth();
    
    const [formData, setFormData] = useState({
        email: "",
        password: ""
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
            
            const response = await API.post(
                "/users/login",
                formData
            );

            console.log("Login response:", response.data);

            // Temporarily save token
            login(response.data.token);

            navigate("/dashboard");

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Login failed"
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
                        <LogIn size={22} />
                    </div>

                    <h1 className="mt-5 text-3xl font-bold">
                        Welcome back
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Login to your SkillBook account
                    </p>

                </div>


                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="rounded-2xl border bg-white p-8 shadow-sm"
                >

                    {error && (
                        <div className="mb-5 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}


                    {/* Email */}
                    <div>

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


                    {/* Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-6 w-full rounded-lg bg-black py-3 font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>


                    {/* Register */}
                    <p className="mt-6 text-center text-sm text-gray-500">

                        Don't have an account?{" "}

                        <Link
                            to="/register"
                            className="font-semibold text-black"
                        >
                            Create one
                        </Link>

                    </p>

                </form>

            </div>

        </div>
    );
}

export default Login;