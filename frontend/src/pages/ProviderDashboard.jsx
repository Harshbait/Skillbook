import { useEffect, useState } from "react";
import {
    BriefcaseBusiness,
    Clock,
    CheckCircle,
    XCircle,
    LoaderCircle,
    Plus,
    LogOut
} from "lucide-react";

import API from "../services/api";
import { useAuth } from "../context/AuthContext";


function ProviderDashboard() {

    const { user, logout } = useAuth();

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // ==========================================
    // GET PROVIDER BOOKINGS
    // ==========================================

    const fetchBookings = async () => {

        try {

            setLoading(true);

            const response = await API.get(
                "/bookings/provider"
            );

            setBookings(
                response.data.bookings || []
            );

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Unable to load bookings"
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        fetchBookings();

    }, []);


    // ==========================================
    // UPDATE BOOKING STATUS
    // ==========================================

    const updateStatus = async (
        bookingId,
        status
    ) => {

        try {

            await API.patch(
                `/bookings/${bookingId}/status`,
                {
                    status
                }
            );

            await fetchBookings();

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.message ||
                "Unable to update booking"
            );

        }
    };


    // ==========================================
    // STATUS STYLE
    // ==========================================

    const getStatusStyle = (status) => {

        switch (status) {

            case "pending":
                return "bg-yellow-100 text-yellow-700";

            case "accepted":
                return "bg-green-100 text-green-700";

            case "rejected":
                return "bg-red-100 text-red-700";

            case "completed":
                return "bg-blue-100 text-blue-700";

            default:
                return "bg-gray-100 text-gray-700";
        }
    };


    return (

        <div className="min-h-screen bg-gray-50">


            {/* ==========================================
                HEADER
            ========================================== */}

            <header className="border-b bg-white">

                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

                    <div>

                        <p className="text-sm text-gray-500">
                            Provider Dashboard
                        </p>

                        <h1 className="mt-1 text-2xl font-bold">
                            Welcome back 👋
                        </h1>

                    </div>


                    <button
                        onClick={logout}
                        className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-100"
                    >

                        <LogOut size={17} />

                        Logout

                    </button>

                </div>

            </header>


            {/* ==========================================
                MAIN
            ========================================== */}

            <main className="mx-auto max-w-7xl px-6 py-10">


                {/* PROVIDER INFO */}

                <div className="rounded-2xl bg-black p-6 text-white">

                    <div className="flex items-center gap-4">

                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-black">

                            <BriefcaseBusiness size={26} />

                        </div>


                        <div>

                            <p className="text-sm text-gray-400">
                                Provider Account
                            </p>

                            <h2 className="text-xl font-semibold">
                                {user?.role}
                            </h2>

                            <p className="text-sm text-gray-400">
                                {user?.userId}
                            </p>

                        </div>

                    </div>

                </div>


                {/* STATS */}

                <div className="mt-8 grid gap-5 md:grid-cols-3">


                    {/* TOTAL */}

                    <div className="rounded-2xl border bg-white p-6">

                        <BriefcaseBusiness
                            size={26}
                            className="text-gray-500"
                        />

                        <p className="mt-4 text-sm text-gray-500">
                            Total Bookings
                        </p>

                        <p className="mt-1 text-3xl font-bold">
                            {bookings.length}
                        </p>

                    </div>


                    {/* PENDING */}

                    <div className="rounded-2xl border bg-white p-6">

                        <Clock
                            size={26}
                            className="text-yellow-600"
                        />

                        <p className="mt-4 text-sm text-gray-500">
                            Pending
                        </p>

                        <p className="mt-1 text-3xl font-bold">

                            {
                                bookings.filter(
                                    booking =>
                                        booking.status === "pending"
                                ).length
                            }

                        </p>

                    </div>


                    {/* COMPLETED */}

                    <div className="rounded-2xl border bg-white p-6">

                        <CheckCircle
                            size={26}
                            className="text-green-600"
                        />

                        <p className="mt-4 text-sm text-gray-500">
                            Completed
                        </p>

                        <p className="mt-1 text-3xl font-bold">

                            {
                                bookings.filter(
                                    booking =>
                                        booking.status === "completed"
                                ).length
                            }

                        </p>

                    </div>

                </div>


                {/* BOOKINGS HEADER */}

                <div className="mt-10 flex items-center justify-between">

                    <div>

                        <h2 className="text-2xl font-bold">
                            Incoming Bookings
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Manage requests from customers.
                        </p>

                    </div>


                    <button
                        className="flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
                    >

                        <Plus size={17} />

                        Add Service

                    </button>

                </div>


                {/* LOADING */}

                {loading && (

                    <div className="flex justify-center py-20">

                        <LoaderCircle
                            size={30}
                            className="animate-spin"
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
                    bookings.length === 0 && (

                        <div className="mt-6 rounded-2xl border bg-white p-12 text-center">

                            <BriefcaseBusiness
                                size={42}
                                className="mx-auto text-gray-400"
                            />

                            <h3 className="mt-4 text-xl font-semibold">
                                No bookings yet
                            </h3>

                            <p className="mt-2 text-gray-500">
                                Customer bookings will appear here.
                            </p>

                        </div>

                    )}


                {/* BOOKINGS */}

                {!loading &&
                    !error &&
                    bookings.length > 0 && (

                        <div className="mt-6 grid gap-5">

                            {bookings.map((booking) => (

                                <div
                                    key={booking._id}
                                    className="rounded-2xl border bg-white p-6 shadow-sm"
                                >

                                    <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">


                                        {/* SERVICE */}

                                        <div>

                                            <h3 className="text-xl font-bold">

                                                {booking.service?.title ||
                                                    "Service"}

                                            </h3>

                                            <p className="mt-2 text-gray-500">

                                                {booking.service?.description ||
                                                    "No description"}

                                            </p>


                                            <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">

                                                <span>
                                                    ₹
                                                    {booking.service?.price ||
                                                        0}
                                                </span>

                                                <span className="flex items-center gap-2">

                                                    <Clock size={16} />

                                                    {booking.service?.duration ||
                                                        "N/A"}

                                                </span>

                                            </div>

                                        </div>


                                        {/* STATUS */}

                                        <span
                                            className={`w-fit rounded-full px-3 py-1 text-sm font-medium ${getStatusStyle(
                                                booking.status
                                            )}`}
                                        >

                                            {booking.status}

                                        </span>

                                    </div>


                                    {/* ACTIONS */}

                                    {booking.status ===
                                        "pending" && (

                                        <div className="mt-6 flex gap-3 border-t pt-5">

                                            <button
                                                onClick={() =>
                                                    updateStatus(
                                                        booking._id,
                                                        "accepted"
                                                    )
                                                }
                                                className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
                                            >

                                                <CheckCircle size={17} />

                                                Accept

                                            </button>


                                            <button
                                                onClick={() =>
                                                    updateStatus(
                                                        booking._id,
                                                        "rejected"
                                                    )
                                                }
                                                className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                                            >

                                                <XCircle size={17} />

                                                Reject

                                            </button>

                                        </div>

                                    )}


                                    {/* COMPLETE */}

                                    {booking.status ===
                                        "accepted" && (

                                        <div className="mt-6 border-t pt-5">

                                            <button
                                                onClick={() =>
                                                    updateStatus(
                                                        booking._id,
                                                        "completed"
                                                    )
                                                }
                                                className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
                                            >

                                                Mark as Completed

                                            </button>

                                        </div>

                                    )}

                                </div>

                            ))}

                        </div>

                    )}

            </main>

        </div>

    );
}


export default ProviderDashboard;