require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

const app = require("./app");
const connectDB = require("./src/config/db");
const Booking = require("./src/models/Booking");
const Message = require("./src/models/Message");

const PORT = process.env.PORT || 5000;

connectDB();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        credentials: true
    }
});

// Socket Authentication Middleware
io.use((socket, next) => {
    try {
        const token =
            socket.handshake.auth?.token ||
            socket.handshake.headers?.authorization?.split(" ")[1];

        if (!token) {
            return next(new Error("Authentication token required"));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.user = decoded;
        next();
    } catch (err) {
        next(new Error("Invalid authentication token"));
    }
});

io.on("connection", (socket) => {
    // Join a specific booking chat room
    socket.on("join_chat", async ({ bookingId }, callback) => {
        try {
            if (!bookingId) {
                if (callback) callback({ error: "Booking ID is required" });
                return;
            }

            const booking = await Booking.findById(bookingId);
            if (!booking) {
                if (callback) callback({ error: "Booking not found" });
                return;
            }

            const userId = socket.user.userId;
            const isCustomer = booking.customer.toString() === userId;
            const isProvider = booking.provider.toString() === userId;

            if (!isCustomer && !isProvider) {
                if (callback) callback({ error: "Unauthorized access to this chat" });
                return;
            }

            const roomName = `booking_${bookingId}`;
            socket.join(roomName);

            if (callback) callback({ success: true, room: roomName });
        } catch (error) {
            if (callback) callback({ error: error.message });
        }
    });

    // Leave a booking chat room
    socket.on("leave_chat", ({ bookingId }) => {
        if (bookingId) {
            socket.leave(`booking_${bookingId}`);
        }
    });

    // Send real-time chat message
    socket.on("send_message", async ({ bookingId, message }, callback) => {
        try {
            if (!bookingId || !message || !message.trim()) {
                if (callback) callback({ error: "Booking ID and message are required" });
                return;
            }

            const booking = await Booking.findById(bookingId);
            if (!booking) {
                if (callback) callback({ error: "Booking not found" });
                return;
            }

            const userId = socket.user.userId;
            const isCustomer = booking.customer.toString() === userId;
            const isProvider = booking.provider.toString() === userId;

            if (!isCustomer && !isProvider) {
                if (callback) callback({ error: "Unauthorized to send messages in this chat" });
                return;
            }

            const receiverId = isCustomer ? booking.provider : booking.customer;

            const newMessage = await Message.create({
                booking: bookingId,
                sender: userId,
                receiver: receiverId,
                message: message.trim()
            });

            const populatedMessage = await Message.findById(newMessage._id)
                .populate("sender", "name email role")
                .populate("receiver", "name email role");

            // Broadcast to all participants in this booking room
            io.to(`booking_${bookingId}`).emit("receive_message", populatedMessage);

            if (callback) callback({ success: true, message: populatedMessage });
        } catch (error) {
            if (callback) callback({ error: error.message });
        }
    });

    socket.on("disconnect", () => {
        // Disconnected cleanly
    });
});

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});