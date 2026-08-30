import { useEffect, useState } from "react";
import {
    Link,
    Navigate
} from "react-router-dom";

import {
    CalendarDays,
    Clock,
    LoaderCircle
} from "lucide-react";

import API from "../services/api";
import { useAuth } from "../context/AuthContext";


function Dashboard() {

    const { user, logout } = useAuth();


    // ==========================================
    // ROLE BASED REDIRECT
    // ==========================================

    // Provider should not see customer dashboard
    if (user?.role === "provider") {
        return (
            <Navigate
                to="/provider-dashboard"
                replace
            />
        );
    }


    // Admin should not see customer dashboard
    if (user?.role === "admin") {
        return (
            <Navigate
                to="/admin-dashboard"
                replace
            />
        );
    }


    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // ==========================================
    // GET CUSTOMER BOOKINGS
    // ==========================================

    useEffect(() => {

        const fetchBookings = async () => {

            try {

                setLoading(true);

                const response = await API.get(
                    "/bookings/my-bookings"
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


        fetchBookings();

    }, []);


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

            <div className="border-b bg-white">

                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">

                    <div>

                        <p className="text-sm text-gray-500">
                            Customer Dashboard
                        </p>

                        <h1 className="mt-1 text-3xl font-bold">
                            Welcome back 👋
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
                MAIN CONTENT
            ========================================== */}

            <main className="mx-auto max-w-7xl px-6 py-10">


                {/* ==========================================
                    USER INFO
                ========================================== */}

                <div className="rounded-2xl bg-black p-6 text-white">

                    <p className="text-sm text-gray-300">
                        Logged in as
                    </p>

                    <h2 className="mt-1 text-xl font-semibold">
                        {user?.role}
                    </h2>

                    <p className="mt-1 text-sm text-gray-400">
                        {user?.userId}
                    </p>

                </div>


                {/* ==========================================
                    BOOKINGS HEADER
                ========================================== */}

                <div className="mt-10 flex items-center justify-between">

                    <div>

                        <h2 className="text-2xl font-bold">
                            My Bookings
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Services you have booked
                        </p>

                    </div>


                    <Link
                        to="/services"
                        className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
                    >
                        Find Services
                    </Link>

                </div>


                {/* ==========================================
                    LOADING
                ========================================== */}

                {loading && (

                    <div className="flex justify-center py-20">

                        <LoaderCircle
                            className="animate-spin"
                            size={30}
                        />

                    </div>

                )}


                {/* ==========================================
                    ERROR
                ========================================== */}

                {!loading && error && (

                    <div className="mt-6 rounded-xl bg-red-50 p-5 text-red-600">

                        {error}

                    </div>

                )}


                {/* ==========================================
                    NO BOOKINGS
                ========================================== */}

                {!loading &&
                    !error &&
                    bookings.length === 0 && (

                        <div className="mt-6 rounded-2xl border bg-white p-12 text-center">

                            <CalendarDays
                                className="mx-auto text-gray-400"
                                size={40}
                            />


                            <h3 className="mt-4 text-xl font-semibold">
                                No bookings yet
                            </h3>


                            <p className="mt-2 text-gray-500">
                                Find a service and book your first one.
                            </p>


                            <Link
                                to="/services"
                                className="mt-6 inline-block rounded-lg bg-black px-5 py-3 font-semibold text-white"
                            >
                                Browse Services
                            </Link>

                        </div>

                    )}


                {/* ==========================================
                    BOOKINGS
                ========================================== */}

                {!loading &&
                    !error &&
                    bookings.length > 0 && (

                        <div className="mt-6 grid gap-5">

                            {bookings.map((booking) => (

                                <div
                                    key={booking._id}
                                    className="rounded-2xl border bg-white p-6 shadow-sm"
                                >


                                    {/* BOOKING DETAILS */}

                                    <div className="flex flex-col justify-between gap-5 md:flex-row">


                                        {/* SERVICE */}

                                        <div>

                                            <h3 className="text-xl font-bold">

                                                {booking.service?.title ||
                                                    "Service"}

                                            </h3>


                                            <p className="mt-2 text-gray-500">

                                                {booking.service?.description ||
                                                    "No description available"}

                                            </p>


                                            <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">


                                                {/* DURATION */}

                                                <span className="flex items-center gap-2">

                                                    <Clock size={16} />

                                                    {booking.service?.duration ||
                                                        "N/A"}

                                                </span>


                                                {/* PRICE */}

                                                <span>

                                                    ₹
                                                    {booking.service?.price ||
                                                        0}

                                                </span>

                                            </div>

                                        </div>


                                        {/* STATUS */}

                                        <div className="flex items-start">

                                            <span
                                                className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusStyle(
                                                    booking.status
                                                )}`}
                                            >
                                                {booking.status}
                                            </span>

                                        </div>

                                    </div>


                                    {/* ==========================================
                                        BOOKING INFO
                                    ========================================== */}

                                    <div className="mt-6 flex flex-wrap items-center gap-5 border-t pt-5 text-sm text-gray-500">


                                        <span>

                                            Booking ID:
                                            {" "}
                                            {booking._id}

                                        </span>


                                        <span>

                                            Created:
                                            {" "}

                                            {new Date(
                                                booking.createdAt
                                            ).toLocaleDateString()}

                                        </span>

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

            </main>

        </div>
    );
}


export default Dashboard;