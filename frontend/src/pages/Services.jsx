import { useEffect, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";

import API from "../services/api";
import ServiceCard from "../components/ServiceCard";

function Services() {

    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");

    const fetchServices = async () => {
        try {
            setLoading(true);

            const response = await API.get("/services", {
                params: {
                    search,
                    category
                }
            });

            setServices(response.data.services);

        } catch (error) {

            console.error(
                "Error fetching services:",
                error
            );

        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchServices();
    }, [search, category]);


    return (
        <div className="min-h-screen bg-gray-50">

            {/* HEADER */}
            <section className="border-b bg-white">

                <div className="mx-auto max-w-7xl px-6 py-12">

                    <h1 className="text-4xl font-bold text-gray-900">
                        Explore Services
                    </h1>

                    <p className="mt-3 text-gray-600">
                        Find the right professional for your project.
                    </p>


                    {/* SEARCH + FILTER */}
                    <div className="mt-8 flex flex-col gap-4 md:flex-row">

                        {/* Search */}
                        <div className="flex flex-1 items-center rounded-xl border bg-white px-4">

                            <Search
                                size={20}
                                className="text-gray-400"
                            />

                            <input
                                type="text"
                                placeholder="Search services..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                                className="w-full px-3 py-3 outline-none"
                            />

                        </div>


                        {/* Category */}
                        <div className="flex items-center rounded-xl border bg-white px-4">

                            <SlidersHorizontal
                                size={20}
                                className="text-gray-400"
                            />

                            <select
                                value={category}
                                onChange={(e) =>
                                    setCategory(e.target.value)
                                }
                                className="bg-transparent px-3 py-3 outline-none"
                            >

                                <option value="">
                                    All Categories
                                </option>

                                <option value="Development">
                                    Development
                                </option>

                                <option value="Design">
                                    Design
                                </option>

                                <option value="Marketing">
                                    Marketing
                                </option>

                                <option value="Writing">
                                    Writing
                                </option>

                            </select>

                        </div>

                    </div>

                </div>

            </section>


            {/* SERVICES */}
            <main className="mx-auto max-w-7xl px-6 py-12">

                {loading ? (

                    <div className="py-20 text-center">
                        <p className="text-gray-500">
                            Loading services...
                        </p>
                    </div>

                ) : services.length === 0 ? (

                    <div className="py-20 text-center">

                        <h2 className="text-xl font-semibold">
                            No services found
                        </h2>

                        <p className="mt-2 text-gray-500">
                            Try changing your search or category.
                        </p>

                    </div>

                ) : (

                    <>

                        <div className="mb-6 flex items-center justify-between">

                            <p className="text-sm text-gray-500">
                                {services.length} services found
                            </p>

                        </div>


                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

                            {services.map((service) => (
                                <ServiceCard
                                    key={service._id}
                                    service={service}
                                />
                            ))}

                        </div>

                    </>

                )}

            </main>

        </div>
    );
}

export default Services;