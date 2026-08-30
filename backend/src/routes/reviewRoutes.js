const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
    createReview,
    getServiceReviews
} = require("../controllers/reviewController");


// Customer creates review
router.post(
    "/",
    protect,
    authorizeRoles("customer"),
    createReview
);


// Anyone can view service reviews
router.get(
    "/service/:serviceId",
    getServiceReviews
);


module.exports = router;