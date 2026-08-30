import { useEffect, useState } from "react";
import {
    useParams,
    Link,
    useNavigate
} from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import {
    ArrowLeft,
    Clock,
    User,
    Tag,
    CheckCircle
} from "lucide-react";

import API from "../services/api";

function ServiceDetails() {

    const { id } = useParams();

    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const fetchService = async () => {
            try {

                setLoading(true);

                const response = await API.get(
                    `/services/${id}`
                );

                setService(response.data.service);

            } catch (error) {

                console.error(error);

                setError(
                    error.response?.data?.message ||
                    "Unable to load service"
                );

            } finally {

                setLoading(false);

            }
        };

        fetchService();

    }, [id]);


    // BOOK SERVICE
    const handleBooking = async () => {

        // User is not logged in
        if (!isAuthenticated) {
            navigate("/login");
            return;
        }


        // Only customers can book
        if (user?.role !== "customer") {
            alert("Only customers can book services.");
            return;
        }


        try {

            const response = await API.post(
                "/bookings",
                {
                    serviceId: service._id
                }
            );

            console.log(
                "Booking created:",
                response.data
            );

            // Go to dashboard after successful booking
            navigate("/dashboard");

        } catch (error) {

            console.error(
                "Booking error:",
                error.response?.data || error
            );

            alert(
                error.response?.data?.message ||
                "Unable to create booking"
            );
        }
    };


    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">

                <p className="text-gray-500">
                    Loading service...
                </p>

            </div>
        );
    }


    if (error) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center">

                <h2 className="text-2xl font-bold">
                    Service not found
                </h2>

                <p className="mt-2 text-gray-500">
                    {error}
                </p>

                <Link
                    to="/services"
                    className="mt-6 rounded-lg bg-black px-5 py-3 text-white"
                >
                    Back to Services
                </Link>

            </div>
        );
    }


    return (
        <div className="min-h-screen bg-gray-50">

            {/* BACK */}
            <div className="mx-auto max-w-7xl px-6 pt-8">

                <Link
                    to="/services"
                    className="flex w-fit items-center gap-2 text-sm text-gray-500 hover:text-black"
                >
                    <ArrowLeft size={18} />
                    Back to Services
                </Link>

            </div>


            {/* MAIN */}
            <main className="mx-auto max-w-7xl px-6 py-10">

                <div className="grid gap-10 lg:grid-cols-3">


                    {/* LEFT */}
                    <div className="lg:col-span-2">


                        {/* IMAGE */}
                        <div className="flex h-80 items-center justify-center rounded-3xl bg-gray-200">

                            <span className="text-8xl font-bold text-gray-300">
                                {service.title.charAt(0)}
                            </span>

                        </div>


                        {/* CONTENT */}
                        <div className="mt-8 rounded-2xl bg-white p-8">


                            {/* CATEGORY + DURATION */}
                            <div className="flex flex-wrap items-center gap-3">

                                <span className="rounded-full bg-gray-100 px-3 py-1 text-sm">
                                    {service.category}
                                </span>

                                <span className="flex items-center gap-1 text-sm text-gray-500">

                                    <Clock size={16} />

                                    {service.duration}

                                </span>

                            </div>


                            {/* TITLE */}
                            <h1 className="mt-5 text-3xl font-bold text-gray-900">
                                {service.title}
                            </h1>


                            {/* DESCRIPTION */}
                            <p className="mt-5 leading-7 text-gray-600">
                                {service.description}
                            </p>


                            {/* PROVIDER */}
                            <div className="mt-8 border-t pt-6">

                                <h2 className="text-lg font-semibold">
                                    About the provider
                                </h2>


                                <div className="mt-4 flex items-center gap-4">

                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">

                                        <User size={22} />

                                    </div>


                                    <div>

                                        <p className="font-semibold">
                                            {service.provider?.name ||
                                                "SkillBook Provider"}
                                        </p>

                                        <p className="text-sm text-gray-500">
                                            {service.provider?.email}
                                        </p>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* RIGHT - BOOKING CARD */}
                    <div>

                        <div className="sticky top-6 rounded-2xl border bg-white p-6 shadow-sm">


                            {/* PRICE */}
                            <div className="flex items-center justify-between">

                                <span className="text-gray-500">
                                    Starting at
                                </span>

                                <span className="text-3xl font-bold">
                                    ₹{service.price}
                                </span>

                            </div>


                            {/* FEATURES */}
                            <div className="my-6 space-y-4 border-y py-6">


                                <div className="flex items-center gap-3">

                                    <CheckCircle
                                        size={20}
                                        className="text-green-600"
                                    />

                                    <span>
                                        Professional service
                                    </span>

                                </div>


                                <div className="flex items-center gap-3">

                                    <Clock size={20} />

                                    <span>
                                        Delivery: {service.duration}
                                    </span>

                                </div>


                                <div className="flex items-center gap-3">

                                    <Tag size={20} />

                                    <span>
                                        {service.category}
                                    </span>

                                </div>

                            </div>


                            {/* BOOK BUTTON */}
                            <button
                                onClick={handleBooking}
                                className="w-full rounded-xl bg-black py-3 text-center font-semibold text-white transition hover:bg-gray-800"
                            >
                                Book This Service
                            </button>


                            <p className="mt-4 text-center text-xs text-gray-400">

                                You will need to login before booking.

                            </p>

                        </div>

                    </div>

                </div>

            </main>

        </div>
    );
}

export default ServiceDetails;