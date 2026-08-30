const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
    createService,
    getAllServices,
    getServiceById,
    updateService,
    deleteService
} = require("../controllers/serviceController");

const {
    createServiceValidation
} = require("../validators/serviceValidator");

const validate = require("../middleware/validationMiddleware");

// Get all services
router.get("/", getAllServices);


// Get single service
router.get("/:id", getServiceById);


// Create service
router.post(
    "/",
    protect,
    authorizeRoles("provider"),
    createService
);


// Update service
router.post(
    "/",
    protect,
    authorizeRoles("provider"),
    createServiceValidation,
    validate,
    createService
);

// Delete service
router.delete(
    "/:id",
    protect,
    authorizeRoles("provider"),
    deleteService
);


module.exports = router;