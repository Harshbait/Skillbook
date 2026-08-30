const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const userRoutes = require("./src/routes/userRoutes.js");
const serviceRoutes = require("./src/routes/serviceRoutes.js");
const bookingRoutes = require("./src/routes/bookingRoutes.js");
const reviewRoutes = require("./src/routes/reviewRoutes.js");
const providerRoutes = require("./src/routes/providerRoutes.js");
const adminRoutes = require("./src/routes/adminRoutes.js");

const errorHandler = require("./src/middleware/errorMiddleware");

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());


// Health check
app.get("/", (req, res) => {
    res.json({
        message: "SkillBook API is running 🚀"
    });
});


// Routes
app.use("/api/users", userRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/providers", providerRoutes);
app.use("/api/admin", adminRoutes);


// Error handler - ALWAYS LAST
app.use(errorHandler);

module.exports = app;