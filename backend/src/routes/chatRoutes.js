const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const { getBookingMessages } = require("../controllers/chatController");

// Get chat history for a booking (protected, must be booking customer or provider)
router.get(
    "/:bookingId",
    protect,
    getBookingMessages
);

module.exports = router;
