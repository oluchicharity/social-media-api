"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidationRules = exports.registerValidationRules = void 0;
// src/validators/registerValidator.ts
const express_validator_1 = require("express-validator");
const registerValidationRules = () => {
    return [
        (0, express_validator_1.body)("username").notEmpty().withMessage("Username is required"),
        (0, express_validator_1.body)("email").isEmail().withMessage("Invalid email address"),
        (0, express_validator_1.body)("password")
            .isLength({ min: 6 })
            .withMessage("Password must be at least 6 characters long"),
    ];
};
exports.registerValidationRules = registerValidationRules;
// Validation for login request
exports.loginValidationRules = [
    (0, express_validator_1.body)("email").isEmail().withMessage("Invalid email format"),
    (0, express_validator_1.body)("password").notEmpty().withMessage("Password is required"),
];
