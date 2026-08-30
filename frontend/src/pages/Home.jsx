import { Link } from "react-router-dom";
import {
    ArrowRight,
    Search,
    Code2,
    Palette,
    Megaphone,
    PenLine
} from "lucide-react";

const categories = [
    {
        name: "Development",
        description: "Websites, apps & software",
        icon: Code2
    },
    {
        name: "Design",
        description: "UI/UX, logos & graphics",
        icon: Palette
    },
    {
        name: "Marketing",
        description: "SEO, social media & ads",
        icon: Megaphone
    },
    {
        name: "Writing",
        description: "Content, blogs & copywriting",
        icon: PenLine
    }
];

function Home() {
    return (
        <div className="bg-white">

            {/* HERO */}
            <section className="bg-gray-50">
                <div className="mx-auto max-w-7xl px-6 py-24 text-center">

                    <div className="mx-auto max-w-3xl">

                        <span className="inline-block rounded-full bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700">
                            The marketplace for skilled people
                        </span>

                        <h1 className="mt-6 text-5xl font-bold tracking-tight text-gray-900 md:text-6xl">
                            Find the right
                            <span className="block">
                                person for the job.
                            </span>
                        </h1>

                        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
                            Discover talented professionals, hire them for
                            your project, and get things done without the
                            hassle.
                        </p>

                        {/* SEARCH */}
                        <div className="mx-auto mt-10 flex max-w-2xl overflow-hidden rounded-xl border bg-white p-2 shadow-sm">

                            <Search
                                className="ml-3 mt-3 text-gray-400"
                                size={22}
                            />

                            <input
                                type="text"
                                placeholder="What service are you looking for?"
                                className="flex-1 px-4 py-2 outline-none"
                            />

                            <Link
                                to="/services"
                                className="rounded-lg bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800"
                            >
                                Search
                            </Link>

                        </div>

                        {/* CTA */}
                        <div className="mt-6 flex justify-center gap-4">

                            <Link
                                to="/services"
                                className="flex items-center gap-2 rounded-lg bg-black px-6 py-3 font-medium text-white hover:bg-gray-800"
                            >
                                Browse Services
                                <ArrowRight size={18} />
                            </Link>

                            <Link
                                to="/register"
                                className="rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 hover:bg-gray-100"
                            >
                                Become a Provider
                            </Link>

                        </div>

                    </div>
                </div>
            </section>


            {/* CATEGORIES */}
            <section className="mx-auto max-w-7xl px-6 py-20">

                <div className="mb-10">
                    <h2 className="text-3xl font-bold text-gray-900">
                        Explore categories
                    </h2>

                    <p className="mt-2 text-gray-600">
                        Find professionals across different fields.
                    </p>
                </div>


                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

                    {categories.map((category) => {

                        const Icon = category.icon;

                        return (
                            <Link
                                key={category.name}
                                to={`/services?category=${category.name}`}
                                className="group rounded-2xl border p-6 transition hover:-translate-y-1 hover:shadow-lg"
                            >

                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
                                    <Icon size={24} />
                                </div>

                                <h3 className="mt-5 text-lg font-semibold">
                                    {category.name}
                                </h3>

                                <p className="mt-2 text-sm text-gray-500">
                                    {category.description}
                                </p>

                                <div className="mt-5 flex items-center gap-2 text-sm font-medium">
                                    Explore
                                    <ArrowRight
                                        size={16}
                                        className="transition group-hover:translate-x-1"
                                    />
                                </div>

                            </Link>
                        );
                    })}

                </div>
            </section>


            {/* HOW IT WORKS */}
            <section className="bg-gray-50">
                <div className="mx-auto max-w-7xl px-6 py-20">

                    <div className="text-center">
                        <h2 className="text-3xl font-bold">
                            How SkillBook works
                        </h2>

                        <p className="mt-3 text-gray-600">
                            Get your project moving in three simple steps.
                        </p>
                    </div>


                    <div className="mt-12 grid gap-8 md:grid-cols-3">

                        <div className="rounded-2xl bg-white p-8">
                            <span className="text-4xl font-bold text-gray-200">
                                01
                            </span>

                            <h3 className="mt-5 text-xl font-semibold">
                                Find a service
                            </h3>

                            <p className="mt-3 text-gray-600">
                                Browse services and discover professionals
                                who match your requirements.
                            </p>
                        </div>


                        <div className="rounded-2xl bg-white p-8">
                            <span className="text-4xl font-bold text-gray-200">
                                02
                            </span>

                            <h3 className="mt-5 text-xl font-semibold">
                                Book a provider
                            </h3>

                            <p className="mt-3 text-gray-600">
                                Choose the right provider and send a booking
                                request for your project.
                            </p>
                        </div>


                        <div className="rounded-2xl bg-white p-8">
                            <span className="text-4xl font-bold text-gray-200">
                                03
                            </span>

                            <h3 className="mt-5 text-xl font-semibold">
                                Get it done
                            </h3>

                            <p className="mt-3 text-gray-600">
                                Work with your provider and complete your
                                project successfully.
                            </p>
                        </div>

                    </div>

                </div>
            </section>


            {/* FINAL CTA */}
            <section className="mx-auto max-w-7xl px-6 py-20">

                <div className="rounded-3xl bg-black px-8 py-16 text-center text-white">

                    <h2 className="text-3xl font-bold md:text-4xl">
                        Ready to get your project started?
                    </h2>

                    <p className="mx-auto mt-4 max-w-xl text-gray-300">
                        Find talented professionals and turn your ideas
                        into reality.
                    </p>

                    <Link
                        to="/services"
                        className="mt-8 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-medium text-black hover:bg-gray-200"
                    >
                        Explore Services
                        <ArrowRight size={18} />
                    </Link>

                </div>

            </section>

        </div>
    );
}

export default Home;