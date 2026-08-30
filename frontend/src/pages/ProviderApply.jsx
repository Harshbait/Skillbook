import { useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../services/api";
import { useAuth } from "../context/AuthContext";


function ProviderApply() {

    const navigate = useNavigate();

    const { isAuthenticated } = useAuth();


    const [formData, setFormData] = useState({
        skills: "",
        bio: "",
        experience: ""
    });

    const [loading, setLoading] = useState(false);


    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };


    const handleSubmit = async (e) => {

        e.preventDefault();


        if (!isAuthenticated) {

            navigate("/login");

            return;
        }


        try {

            setLoading(true);


            const response = await API.post(
                "/providers/apply",
                {
                    skills: formData.skills
                        .split(",")
                        .map(skill => skill.trim())
                        .filter(Boolean),

                    bio: formData.bio,

                    experience: Number(
                        formData.experience
                    )
                }
            );


            alert(response.data.message);

            navigate("/dashboard");


        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.message ||
                "Unable to submit application"
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="min-h-screen bg-gray-50 px-6 py-12">

            <div className="mx-auto max-w-2xl">

                <div className="rounded-2xl border bg-white p-8 shadow-sm">

                    <h1 className="text-3xl font-bold">
                        Become a SkillBook Provider
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Tell us about your skills and experience.
                    </p>


                    <form
                        onSubmit={handleSubmit}
                        className="mt-8 space-y-6"
                    >


                        {/* SKILLS */}

                        <div>

                            <label className="text-sm font-medium">
                                Skills
                            </label>

                            <input
                                type="text"
                                name="skills"
                                value={formData.skills}
                                onChange={handleChange}
                                placeholder="React, Node.js, MongoDB"
                                required
                                className="mt-2 w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
                            />

                            <p className="mt-1 text-xs text-gray-400">
                                Separate skills with commas.
                            </p>

                        </div>


                        {/* EXPERIENCE */}

                        <div>

                            <label className="text-sm font-medium">
                                Experience (years)
                            </label>

                            <input
                                type="number"
                                name="experience"
                                min="0"
                                value={formData.experience}
                                onChange={handleChange}
                                placeholder="2"
                                required
                                className="mt-2 w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
                            />

                        </div>


                        {/* BIO */}

                        <div>

                            <label className="text-sm font-medium">
                                About You
                            </label>

                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                placeholder="Tell customers about your experience..."
                                rows="5"
                                required
                                className="mt-2 w-full resize-none rounded-lg border px-4 py-3 outline-none focus:border-black"
                            />

                        </div>


                        {/* SUBMIT */}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-xl bg-black py-3 font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
                        >

                            {loading
                                ? "Submitting..."
                                : "Submit Application"}

                        </button>

                    </form>

                </div>

            </div>

        </div>

    );
}


export default ProviderApply;