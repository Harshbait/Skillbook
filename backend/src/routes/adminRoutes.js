const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
    getProviderApplications,
    approveProvider,
    rejectProvider,
    revokeProvider
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


// Revoke provider access
router.patch(
    "/providers/:id/revoke",
    protect,
    authorizeRoles("admin"),
    revokeProvider
);


module.exports = router;