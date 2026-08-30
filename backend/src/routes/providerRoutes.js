const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
    applyAsProvider
} = require("../controllers/providerController");


// Customer applies to become provider
router.post(
    "/apply",
    protect,
    authorizeRoles("customer"),
    applyAsProvider
);


module.exports = router;