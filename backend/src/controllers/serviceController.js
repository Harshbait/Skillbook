const Service = require("../models/Service");


// CREATE SERVICE
const createService = async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            price,
            duration
        } = req.body;

        const service = await Service.create({
            title,
            description,
            category,
            price,
            duration,
            provider: req.user.userId
        });

        res.status(201).json({
            message: "Service created successfully",
            service
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// GET ALL SERVICES
// GET ALL SERVICES
const getAllServices = async (req, res) => {
    try {
        const {
            search,
            category,
            minPrice,
            maxPrice,
            sort,
            page = 1,
            limit = 10
        } = req.query;

        // Build filter
        const filter = {};

        // Search by title or description
        if (search) {
            filter.$or = [
                {
                    title: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    description: {
                        $regex: search,
                        $options: "i"
                    }
                }
            ];
        }

        // Category filter
        if (category) {
            filter.category = category;
        }

        // Price filter
        if (minPrice || maxPrice) {
            filter.price = {};

            if (minPrice) {
                filter.price.$gte = Number(minPrice);
            }

            if (maxPrice) {
                filter.price.$lte = Number(maxPrice);
            }
        }

        // Pagination
        const pageNumber = Math.max(Number(page), 1);
        const limitNumber = Math.min(Math.max(Number(limit), 1), 100);

        const skip = (pageNumber - 1) * limitNumber;

        // Sorting
        let sortOption = {
            createdAt: -1
        };

        if (sort === "price_asc") {
            sortOption = { price: 1 };
        }

        if (sort === "price_desc") {
            sortOption = { price: -1 };
        }

        if (sort === "newest") {
            sortOption = { createdAt: -1 };
        }

        if (sort === "oldest") {
            sortOption = { createdAt: 1 };
        }

        const services = await Service.find(filter)
            .populate("provider", "name email")
            .sort(sortOption)
            .skip(skip)
            .limit(limitNumber);

        const totalServices = await Service.countDocuments(filter);

        const totalPages = Math.ceil(
            totalServices / limitNumber
        );

        res.status(200).json({
            services,
            pagination: {
                currentPage: pageNumber,
                limit: limitNumber,
                totalServices,
                totalPages
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// GET SINGLE SERVICE
const getServiceById = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id)
            .populate("provider", "name email role");

        if (!service) {
            return res.status(404).json({
                message: "Service not found"
            });
        }

        res.status(200).json({
            service
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// UPDATE SERVICE
const updateService = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);

        if (!service) {
            return res.status(404).json({
                message: "Service not found"
            });
        }

        // Check ownership
        if (service.provider.toString() !== req.user.userId) {
            return res.status(403).json({
                message: "You can only update your own services"
            });
        }

        const {
            title,
            description,
            category,
            price,
            duration
        } = req.body;

        service.title = title || service.title;
        service.description = description || service.description;
        service.category = category || service.category;
        service.price = price ?? service.price;
        service.duration = duration || service.duration;

        await service.save();

        res.status(200).json({
            message: "Service updated successfully",
            service
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// DELETE SERVICE
const deleteService = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);

        if (!service) {
            return res.status(404).json({
                message: "Service not found"
            });
        }

        // Check ownership
        if (service.provider.toString() !== req.user.userId) {
            return res.status(403).json({
                message: "You can only delete your own services"
            });
        }

        await service.deleteOne();

        res.status(200).json({
            message: "Service deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


module.exports = {
    createService,
    getAllServices,
    getServiceById,
    updateService,
    deleteService
};