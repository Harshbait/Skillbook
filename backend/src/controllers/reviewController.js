const Review = require("../models/Review");
const Booking = require("../models/Booking");

const createReview = async (req, res) => {
    try {
        const { bookingId, rating, comment } = req.body;

        if (!bookingId || !rating) {
            return res.status(400).json({
                message: "Booking ID and rating are required"
            });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                message: "Rating must be between 1 and 5"
            });
        }

        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        // Only the customer who made the booking can review it
        if (booking.customer.toString() !== req.user.userId) {
            return res.status(403).json({
                message: "You can only review your own bookings"
            });
        }

        // Review only after completion
        if (booking.status !== "completed") {
            return res.status(400).json({
                message: "You can only review completed bookings"
            });
        }

        // Prevent duplicate review
        const existingReview = await Review.findOne({
            booking: bookingId
        });

        if (existingReview) {
            return res.status(400).json({
                message: "You have already reviewed this booking"
            });
        }

        const review = await Review.create({
            service: booking.service,
            customer: booking.customer,
            provider: booking.provider,
            booking: booking._id,
            rating,
            comment
        });

        res.status(201).json({
            message: "Review created successfully",
            review
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


const getServiceReviews = async (req, res) => {
    try {
        const reviews = await Review.find({
            service: req.params.serviceId
        })
            .populate("customer", "name")
            .sort({ createdAt: -1 });

        res.status(200).json({
            reviews
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


module.exports = {
    createReview,
    getServiceReviews
};