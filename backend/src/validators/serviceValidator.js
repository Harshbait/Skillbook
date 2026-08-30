const { body } = require("express-validator");

const createServiceValidation = [
    body("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required"),

    body("description")
        .trim()
        .notEmpty()
        .withMessage("Description is required"),

    body("category")
        .trim()
        .notEmpty()
        .withMessage("Category is required"),

    body("price")
        .isNumeric()
        .withMessage("Price must be a number")
        .custom((value) => value > 0)
        .withMessage("Price must be greater than 0"),

    body("duration")
        .trim()
        .notEmpty()
        .withMessage("Duration is required")
];

module.exports = {
    createServiceValidation
};