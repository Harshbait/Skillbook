export const CATEGORIES = [
    { name: "Development", description: "Websites, apps and software" },
    { name: "Design", description: "UI/UX, logos and graphics" },
    { name: "Marketing", description: "SEO, social and growth" },
    { name: "Writing", description: "Content, blogs and copy" },
];

export function dashboardPath(role) {
    if (role === "admin") return "/admin-dashboard";
    if (role === "provider") return "/provider-dashboard";
    return "/dashboard";
}

export function formatPrice(value) {
    const amount = Number(value) || 0;
    return `₹${amount.toLocaleString("en-IN")}`;
}

export function formatDate(value) {
    if (!value) return "—";
    return new Date(value).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

export function providerIdOf(service) {
    if (!service?.provider) return null;
    if (typeof service.provider === "string") return service.provider;
    return service.provider._id;
}

export function isOwnService(service, user) {
    const providerId = providerIdOf(service);
    if (!providerId || !user) return false;
    return providerId === user.userId || providerId === user._id;
}

export async function fetchAllServices(API) {
    const collected = [];
    let page = 1;

    while (true) {
        const { data } = await API.get("/services", {
            params: { page, limit: 100 },
        });
        collected.push(...(data.services || []));
        const totalPages = data.pagination?.totalPages || 1;
        if (page >= totalPages) break;
        page += 1;
    }

    return collected;
}
