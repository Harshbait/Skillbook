import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

function ServiceCard({ service }) {
    return (
        <div className="group overflow-hidden rounded-2xl border bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl">

            {/* Image placeholder */}
            <div className="flex h-48 items-center justify-center bg-gray-100">
                <span className="text-5xl font-bold text-gray-300">
                    {service.title.charAt(0)}
                </span>
            </div>

            <div className="p-5">

                <div className="mb-3 flex items-center justify-between">

                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                        {service.category}
                    </span>

                    <span className="font-semibold">
                        ₹{service.price}
                    </span>

                </div>

                <h3 className="text-lg font-semibold text-gray-900">
                    {service.title}
                </h3>

                <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                    {service.description}
                </p>

                <div className="mt-5 flex items-center justify-between">

                    <span className="text-sm text-gray-500">
                        {service.duration}
                    </span>

                    <Link
                        to={`/services/${service._id}`}
                        className="flex items-center gap-1 text-sm font-semibold"
                    >
                        View
                        <ArrowRight
                            size={16}
                            className="transition group-hover:translate-x-1"
                        />
                    </Link>

                </div>

            </div>
        </div>
    );
}

export default ServiceCard;