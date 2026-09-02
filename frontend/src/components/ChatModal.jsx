import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { Send, X, MessageSquare, AlertCircle } from "lucide-react";
import API from "../services/api";
import Loading from "./Loading";

function ChatModal({ open, booking, onClose, currentUser }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");
    const socketRef = useRef(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Load message history and initialize socket
    useEffect(() => {
        if (!open || !booking?._id) {
            return undefined;
        }

        let isMounted = true;
        setLoading(true);
        setError("");

        // 1. Fetch chat history
        const fetchHistory = async () => {
            try {
                const res = await API.get(`/chat/${booking._id}`);
                if (isMounted) {
                    setMessages(res.data.messages || []);
                    setLoading(false);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err.response?.data?.message || "Failed to load chat history");
                    setLoading(false);
                }
            }
        };

        fetchHistory();

        // 2. Setup Socket.io connection
        const token = localStorage.getItem("token");
        const socketUrl = "http://localhost:5000";

        const socket = io(socketUrl, {
            auth: { token },
            transports: ["websocket", "polling"],
        });

        socketRef.current = socket;

        socket.on("connect", () => {
            socket.emit("join_chat", { bookingId: booking._id });
        });

        socket.on("receive_message", (incomingMsg) => {
            if (incomingMsg.booking?.toString() === booking._id.toString() ||
                incomingMsg.booking?._id?.toString() === booking._id.toString()) {
                setMessages((prev) => {
                    // Prevent duplicate if already added
                    if (prev.some((m) => m._id === incomingMsg._id)) return prev;
                    return [...prev, incomingMsg];
                });
            }
        });

        socket.on("connect_error", (err) => {
            console.error("Socket error:", err.message);
        });

        return () => {
            isMounted = false;
            socket.emit("leave_chat", { bookingId: booking._id });
            socket.disconnect();
        };
    }, [open, booking]);

    // Auto scroll when messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    if (!open || !booking) return null;

    const handleSendMessage = (e) => {
        e.preventDefault();
        const text = newMessage.trim();
        if (!text || sending) return;

        if (!socketRef.current || !socketRef.current.connected) {
            setError("Chat server disconnected. Please try again.");
            return;
        }

        setSending(true);
        socketRef.current.emit(
            "send_message",
            { bookingId: booking._id, message: text },
            (response) => {
                setSending(false);
                if (response?.error) {
                    setError(response.error);
                } else {
                    setNewMessage("");
                    setError("");
                }
            }
        );
    };

    const currentUserId = currentUser?.userId || currentUser?._id;
    const isCustomer = booking.customer?._id === currentUserId || booking.customer === currentUserId;
    const otherParticipant = isCustomer ? booking.provider : booking.customer;
    const otherParticipantName = otherParticipant?.name || "User";
    const otherParticipantRole = isCustomer ? "Provider" : "Customer";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-ink/60 dark:bg-black/70 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Chat Dialog Box */}
            <div className="relative z-10 flex h-[85vh] max-h-[680px] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white dark:bg-[#11131a] shadow-2xl animate-fade-up border border-line dark:border-line">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-line/60 dark:border-line bg-ink dark:bg-[#161922] px-6 py-4 text-white">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-500/20 text-teal-300 font-bold border border-teal-500/30">
                            {otherParticipantName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="font-display text-base font-bold leading-tight">
                                    {otherParticipantName}
                                </h3>
                                <span className="rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-teal-200 uppercase tracking-wider">
                                    {otherParticipantRole}
                                </span>
                            </div>
                            <p className="text-xs text-zinc-400 line-clamp-1">
                                Service: {booking.service?.title || "Booking Conversation"}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl p-2 text-zinc-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                        aria-label="Close Chat"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Messages Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-canvas/30 dark:bg-[#0c0d12]">
                    {loading && (
                        <div className="flex h-full items-center justify-center">
                            <Loading label="Connecting & loading messages..." />
                        </div>
                    )}

                    {!loading && error && (
                        <div className="flex items-center gap-2 rounded-xl bg-rose-50 dark:bg-rose-950/30 p-4 text-xs font-semibold text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40">
                            <AlertCircle size={16} />
                            <span>{error}</span>
                        </div>
                    )}

                    {!loading && !error && messages.length === 0 && (
                        <div className="flex h-full flex-col items-center justify-center text-center p-6 space-y-2">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400">
                                <MessageSquare size={24} />
                            </div>
                            <p className="text-sm font-bold text-ink dark:text-white">No messages yet</p>
                            <p className="text-xs text-muted dark:text-zinc-400 max-w-xs">
                                Start the conversation regarding requirements, timeline, or updates for this booking.
                            </p>
                        </div>
                    )}

                    {!loading &&
                        messages.map((msg) => {
                            const senderId = msg.sender?._id || msg.sender;
                            const isMe = senderId === currentUserId;

                            return (
                                <div
                                    key={msg._id || `${msg.createdAt}-${msg.message}`}
                                    className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                                >
                                    <div className="flex items-center gap-1.5 mb-1 px-1">
                                        <span className="text-[11px] font-semibold text-muted dark:text-zinc-400">
                                            {isMe ? "You" : msg.sender?.name || otherParticipantName}
                                        </span>
                                        <span className="text-[10px] text-muted/70 dark:text-zinc-500">
                                            {new Date(msg.createdAt).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </span>
                                    </div>
                                    <div
                                        className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-xs font-medium shadow-sm leading-relaxed ${
                                            isMe
                                                ? "bg-ink dark:bg-teal-600 text-white rounded-tr-xs"
                                                : "bg-white dark:bg-[#181b26] text-ink dark:text-zinc-100 border border-line dark:border-line rounded-tl-xs"
                                        }`}
                                    >
                                        <p className="whitespace-pre-wrap break-words">{msg.message}</p>
                                    </div>
                                </div>
                            );
                        })}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Footer */}
                <form
                    onSubmit={handleSendMessage}
                    className="flex items-center gap-2 border-t border-line/60 dark:border-line bg-white dark:bg-[#11131a] p-4"
                >
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder={`Message ${otherParticipantName}...`}
                        className="flex-1 rounded-xl border border-line dark:border-line bg-canvas/40 dark:bg-white/5 px-4 py-2.5 text-xs font-medium text-ink dark:text-white placeholder:text-muted dark:placeholder:text-zinc-500 focus:border-ink dark:focus:border-teal-500 focus:bg-white dark:focus:bg-[#161922] focus:outline-none transition-colors"
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        disabled={loading || !newMessage.trim() || sending}
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-ink dark:bg-teal-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-zinc-800 dark:hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer shadow-sm active:scale-98"
                    >
                        <Send size={14} className="stroke-[2.5]" />
                        <span>Send</span>
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ChatModal;
