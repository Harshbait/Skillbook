import { Clock, Calendar, User, UserCheck, Wallet, MessageSquare } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { formatDate, formatPrice } from "../utils/constants";

function BookingCard({ booking, actions, onChat }) {
    const isProviderView = Boolean(booking.customer?.name);

    return (
        <article className="rounded-2xl border border-line/65 dark:border-line bg-white dark:bg-[#11131a] p-5 shadow-sm sm:p-6 transition-all duration-200 hover:shadow-md">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-canvas dark:bg-white/5 text-muted dark:text-zinc-400 border border-line/50 dark:border-line">
                            {booking.service?.category || "General"}
                        </span>
                        <span className="text-xs font-medium text-muted dark:text-zinc-400 flex items-center gap-1">
                            <Calendar size={13} />
                            Ordered {formatDate(booking.createdAt)}
                        </span>
                    </div>
                    <h3 className="mt-2 font-display text-lg font-bold text-ink dark:text-zinc-100 leading-snug">
                        {booking.service?.title || "Service Listing"}
                    </h3>
                    <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted dark:text-zinc-400">
                        {booking.service?.description || "No service description available"}
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 shrink-0 self-start sm:self-auto">
                    <StatusBadge status={booking.status} />
                </div>
            </div>

            {/* Note to provider if any */}
            {booking.message && (
                <div className="mt-4 rounded-xl border border-line/50 dark:border-line bg-canvas/45 dark:bg-white/5 p-3.5 text-xs text-muted dark:text-zinc-300 flex gap-2 items-start">
                    <MessageSquare size={14} className="shrink-0 text-muted/75 dark:text-zinc-400 mt-0.5" />
                    <p className="leading-relaxed">
                        <span className="font-semibold text-ink dark:text-zinc-200">Note from customer:</span> "{booking.message}"
                    </p>
                </div>
            )}

            <div className="mt-5 flex flex-wrap items-center gap-y-3.5 gap-x-6 border-t border-line/50 dark:border-line pt-4 text-xs font-semibold text-muted dark:text-zinc-400">
                <span className="flex items-center gap-1.5 text-accent dark:text-teal-400 text-sm font-bold bg-accent/5 dark:bg-teal-500/10 px-2.5 py-1 rounded-lg">
                    <Wallet size={14} />
                    {formatPrice(booking.service?.price)}
                </span>
                
                <span className="flex items-center gap-1.5">
                    <Clock size={14} className="text-muted/75 dark:text-zinc-400" />
                    {booking.service?.duration || "N/A"}
                </span>

                {isProviderView && booking.customer?.name && (
                    <span className="flex items-center gap-1.5">
                        <User size={14} className="text-muted/75 dark:text-zinc-400" />
                        Customer: <span className="text-ink dark:text-zinc-200 font-bold">{booking.customer.name}</span>
                    </span>
                )}

                {!isProviderView && booking.provider?.name && (
                    <span className="flex items-center gap-1.5">
                        <UserCheck size={14} className="text-muted/75 dark:text-zinc-400" />
                        Provider: <span className="text-ink dark:text-zinc-200 font-bold">{booking.provider.name}</span>
                    </span>
                )}
            </div>

            {/* Action Buttons */}
            {(actions || onChat) && (
                <div className="mt-5 flex flex-wrap items-center justify-end gap-2.5 border-t border-line/50 dark:border-line pt-4.5">
                    {onChat && (
                        <button
                            type="button"
                            onClick={() => onChat(booking)}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-line dark:border-line bg-white dark:bg-white/5 px-3.5 py-2 text-xs font-bold text-ink dark:text-zinc-200 hover:bg-canvas dark:hover:bg-white/10 shadow-sm active:scale-98 transition-all cursor-pointer"
                        >
                            <MessageSquare size={13} className="text-teal-600 dark:text-teal-400" />
                            {isProviderView ? "Chat with Customer" : "Chat with Provider"}
                        </button>
                    )}

                    {actions}
                </div>
            )}
        </article>
    );
}

export default BookingCard;
