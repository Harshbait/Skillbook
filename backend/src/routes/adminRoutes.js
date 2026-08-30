const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
    getProviderApplications,
    approveProvider,
    rejectProvider
} = require("../controllers/adminController");


// Get provider applications
router.get(
    "/providers",
    protect,
    authorizeRoles("admin"),
    getProviderApplications
);


// Approve provider
router.patch(
    "/providers/:id/approve",
    protect,
    authorizeRoles("admin"),
    approveProvider
);


// Reject provider
router.patch(
    "/providers/:id/reject",
    protect,
    authorizeRoles("admin"),
    rejectProvider
);


module.exports = router;