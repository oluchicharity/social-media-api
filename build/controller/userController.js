"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = void 0;
const express_validator_1 = require("express-validator");
const userModel_1 = __importDefault(require("../models/userModel"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate request body
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return; // Return here to avoid executing further code
        }
        const { username, email, password } = req.body;
        // Hash the password
        const hashedPassword = bcrypt_1.default.hashSync(password, 10);
        // console.log('Hashed password:', hashedPassword);
        // Check if the email is already registered
        const existingUser = yield userModel_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({ error: 'Email already exists' });
            return; // Return here to avoid executing further code
        }
        // Create a new user
        const newUser = new userModel_1.default({ username, email, password: hashedPassword });
        const savedUser = yield newUser.save();
        // You may choose to generate and send an authentication token here, come back here for login
        res.status(201).json({ message: 'User registered successfully', user: savedUser });
    }
    catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.registerUser = registerUser;
