const Message = require("../models/Message");
const Booking = require("../models/Booking");

// Get all messages for a specific booking
const getBookingMessages = async (req, res) => {
    try {
        const { bookingId } = req.params;

        if (!bookingId) {
            return res.status(400).json({
                message: "Booking ID is required"
            });
        }

        const booking = await Booking.findById(bookingId)
            .populate("customer", "name email role")
            .populate("provider", "name email role")
            .populate("service", "title category price");

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        const userId = req.user.userId;
        const isCustomer = booking.customer._id.toString() === userId;
        const isProvider = booking.provider._id.toString() === userId;

        // Security check: Only customer or provider for this booking can view chat
        if (!isCustomer && !isProvider) {
            return res.status(403).json({
                message: "You are not authorized to view messages for this booking"
            });
        }

        const messages = await Message.find({ booking: bookingId })
            .populate("sender", "name email role")
            .populate("receiver", "name email role")
            .sort({ createdAt: 1 });

        res.status(200).json({
            booking: {
                _id: booking._id,
                status: booking.status,
                service: booking.service,
                customer: booking.customer,
                provider: booking.provider
            },
            messages
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error retrieving chat messages",
            error: error.message
        });
    }
};

module.exports = {
    getBookingMessages
};
