const Booking = require("../models/Booking");
const Service = require("../models/Service");

const createBooking = async (req, res) => {
    try {
        const { serviceId, message } = req.body;

        const service = await Service.findById(serviceId);

        if (!service) {
            return res.status(404).json({
                message: "Service not found"
            });
        }

        // Customer cannot book their own service
        if (service.provider.toString() === req.user.userId) {
            return res.status(400).json({
                message: "You cannot book your own service"
            });
        }

        const booking = await Booking.create({
            service: service._id,
            customer: req.user.userId,
            provider: service.provider,
            message
        });

        res.status(201).json({
            message: "Booking created successfully",
            booking
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({
            customer: req.user.userId
        })
            .populate("service", "title description category price duration")
            .populate("provider", "name email");

        res.status(200).json({
            bookings
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

const getProviderBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({
            provider: req.user.userId
        })
            .populate("service", "title description category price duration")
            .populate("customer", "name email");

        res.status(200).json({
            bookings
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

const updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const allowedStatuses = ["accepted", "rejected"];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid status"
            });
        }

        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        // Only the provider who owns the booking can update it
        if (booking.provider.toString() !== req.user.userId) {
            return res.status(403).json({
                message: "You can only manage your own bookings"
            });
        }

        // Only pending bookings can be accepted/rejected
        if (booking.status !== "pending") {
            return res.status(400).json({
                message: "Only pending bookings can be updated"
            });
        }

        booking.status = status;

        await booking.save();

        res.status(200).json({
            message: `Booking ${status} successfully`,
            booking
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

const completeBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        // Only the provider who owns this booking can complete it
        if (booking.provider.toString() !== req.user.userId) {
            return res.status(403).json({
                message: "You can only complete your own bookings"
            });
        }

        // Only accepted bookings can be completed
        if (booking.status !== "accepted") {
            return res.status(400).json({
                message: "Only accepted bookings can be completed"
            });
        }

        booking.status = "completed";

        await booking.save();

        res.status(200).json({
            message: "Booking completed successfully",
            booking
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

module.exports = {
    createBooking,
    getMyBookings,
    getProviderBookings,
    updateBookingStatus,
    completeBooking
};