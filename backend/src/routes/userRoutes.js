const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const authorizeRoles = require("../middleware/roleMiddleware");

const {
    registerUser,
    loginUser,
    getProfile
} = require("../controllers/userController");


// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Protected profile
router.get("/profile", protect, getProfile);

router.get(
    "/provider-test",
    protect,
    authorizeRoles("provider"),
    (req, res) => {
        res.json({
            message: "Welcome Provider! You have access."
        });
    }
);

module.exports = router;