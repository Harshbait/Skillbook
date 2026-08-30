const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
    createBooking,
    getMyBookings,
    getProviderBookings,
    updateBookingStatus,
    completeBooking
} = require("../controllers/bookingController");


// Customer creates booking
router.post(
    "/",
    protect,
    authorizeRoles("customer"),
    createBooking
);


// Customer gets their bookings
router.get(
    "/my-bookings",
    protect,
    authorizeRoles("customer"),
    getMyBookings
);


// Provider gets incoming bookings
router.get(
    "/provider",
    protect,
    authorizeRoles("provider"),
    getProviderBookings
);


// Provider accepts/rejects booking
router.patch(
    "/:id/status",
    protect,
    authorizeRoles("provider"),
    updateBookingStatus
);


// Provider completes booking
router.patch(
    "/:id/complete",
    protect,
    authorizeRoles("provider"),
    completeBooking
);


module.exports = router;