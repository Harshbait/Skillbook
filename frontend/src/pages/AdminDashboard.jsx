import { useEffect, useState } from "react";
import {
    Users,
    UserCheck,
    UserX,
    LoaderCircle
} from "lucide-react";

import API from "../services/api";
import { useAuth } from "../context/AuthContext";


function AdminDashboard() {

    const { user, logout } = useAuth();

    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updatingId, setUpdatingId] = useState(null);


    // ==========================================
    // GET PROVIDERS
    // ==========================================

    const fetchProviders = async () => {

        try {

            setLoading(true);

            const response = await API.get(
                "/admin/providers"
            );

            setProviders(
                response.data.providers || []
            );

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Unable to load providers"
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        fetchProviders();

    }, []);


    // ==========================================
    // UPDATE PROVIDER STATUS
    // ==========================================

    const updateProviderStatus = async (
        providerId,
        status
    ) => {

        try {

            setUpdatingId(providerId);

            await API.patch(
                `/admin/providers/${providerId}`,
                {
                    status
                }
            );

            await fetchProviders();

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.message ||
                "Unable to update provider"
            );

        } finally {

            setUpdatingId(null);

        }
    };


    return (
        <div className="min-h-screen bg-gray-50">


            {/* ==========================================
                HEADER
            ========================================== */}

            <div className="border-b bg-white">

                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">

                    <div>

                        <p className="text-sm text-gray-500">
                            Admin Dashboard
                        </p>

                        <h1 className="mt-1 text-3xl font-bold">
                            Manage SkillBook 🛠️
                        </h1>

                    </div>


                    <button
                        onClick={logout}
                        className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-100"
                    >
                        Logout
                    </button>

                </div>

            </div>


            {/* ==========================================
                MAIN
            ========================================== */}

            <main className="mx-auto max-w-7xl px-6 py-10">


                {/* ADMIN INFO */}

                <div className="rounded-2xl bg-black p-6 text-white">

                    <p className="text-sm text-gray-300">
                        Logged in as
                    </p>

                    <h2 className="mt-1 text-xl font-semibold">
                        Admin
                    </h2>

                    <p className="mt-1 text-sm text-gray-400">
                        {user?.userId}
                    </p>

                </div>


                {/* STATS */}

                <div className="mt-8 grid gap-5 md:grid-cols-3">

                    <div className="rounded-2xl border bg-white p-6">

                        <Users
                            size={28}
                            className="text-gray-500"
                        />

                        <p className="mt-4 text-sm text-gray-500">
                            Total Providers
                        </p>

                        <p className="mt-1 text-3xl font-bold">
                            {providers.length}
                        </p>

                    </div>


                    <div className="rounded-2xl border bg-white p-6">

                        <UserCheck
                            size={28}
                            className="text-green-600"
                        />

                        <p className="mt-4 text-sm text-gray-500">
                            Approved
                        </p>

                        <p className="mt-1 text-3xl font-bold">
                            {
                                providers.filter(
                                    provider =>
                                        provider.status === "approved"
                                ).length
                            }
                        </p>

                    </div>


                    <div className="rounded-2xl border bg-white p-6">

                        <UserX
                            size={28}
                            className="text-yellow-600"
                        />

                        <p className="mt-4 text-sm text-gray-500">
                            Pending
                        </p>

                        <p className="mt-1 text-3xl font-bold">
                            {
                                providers.filter(
                                    provider =>
                                        provider.status === "pending"
                                ).length
                            }
                        </p>

                    </div>

                </div>


                {/* PROVIDERS */}

                <div className="mt-10">

                    <h2 className="text-2xl font-bold">
                        Providers
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Review and manage provider accounts.
                    </p>

                </div>


                {/* LOADING */}

                {loading && (

                    <div className="flex justify-center py-20">

                        <LoaderCircle
                            className="animate-spin"
                            size={30}
                        />

                    </div>

                )}


                {/* ERROR */}

                {!loading && error && (

                    <div className="mt-6 rounded-xl bg-red-50 p-5 text-red-600">
                        {error}
                    </div>

                )}


                {/* EMPTY */}

                {!loading &&
                    !error &&
                    providers.length === 0 && (

                        <div className="mt-6 rounded-2xl border bg-white p-12 text-center">

                            <Users
                                className="mx-auto text-gray-400"
                                size={40}
                            />

                            <h3 className="mt-4 text-xl font-semibold">
                                No providers found
                            </h3>

                        </div>

                    )}


                {/* PROVIDER LIST */}

                {!loading &&
                    !error &&
                    providers.length > 0 && (

                        <div className="mt-6 grid gap-5">

                            {providers.map((provider) => (

                                <div
                                    key={provider._id}
                                    className="rounded-2xl border bg-white p-6 shadow-sm"
                                >

                                    <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">


                                        {/* PROVIDER DETAILS */}

                                        <div>

                                            <h3 className="text-lg font-bold">
                                                {provider.name ||
                                                    "Provider"}
                                            </h3>

                                            <p className="mt-1 text-sm text-gray-500">
                                                {provider.email}
                                            </p>

                                            <p className="mt-1 text-xs text-gray-400">
                                                ID: {provider._id}
                                            </p>

                                        </div>


                                        {/* STATUS */}

                                        <span
                                            className={`w-fit rounded-full px-3 py-1 text-sm font-medium ${
                                                provider.status ===
                                                "approved"
                                                    ? "bg-green-100 text-green-700"
                                                    : provider.status ===
                                                      "rejected"
                                                    ? "bg-red-100 text-red-700"
                                                    : "bg-yellow-100 text-yellow-700"
                                            }`}
                                        >
                                            {provider.status ||
                                                "pending"}
                                        </span>

                                    </div>


                                    {/* ACTIONS */}

                                    <div className="mt-5 flex flex-wrap gap-3 border-t pt-5">

                                        {provider.status !==
                                            "approved" && (

                                            <button
                                                disabled={
                                                    updatingId ===
                                                    provider._id
                                                }
                                                onClick={() =>
                                                    updateProviderStatus(
                                                        provider._id,
                                                        "approved"
                                                    )
                                                }
                                                className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                                            >

                                                <UserCheck size={17} />

                                                Approve

                                            </button>

                                        )}


                                        {provider.status !==
                                            "rejected" && (

                                            <button
                                                disabled={
                                                    updatingId ===
                                                    provider._id
                                                }
                                                onClick={() =>
                                                    updateProviderStatus(
                                                        provider._id,
                                                        "rejected"
                                                    )
                                                }
                                                className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                                            >

                                                <UserX size={17} />

                                                Reject

                                            </button>

                                        )}

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

            </main>

        </div>
    );
}


export default AdminDashboard;