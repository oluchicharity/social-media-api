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
exports.getFeed = exports.unfollowUser = exports.followUser = exports.loginUser = exports.registerUser = void 0;
const express_validator_1 = require("express-validator");
const userModel_1 = __importDefault(require("../models/userModel"));
const postModel_1 = __importDefault(require("../models/postModel"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate request body
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        const { username, email, password } = req.body;
        // Hash the password
        const hashedPassword = bcrypt_1.default.hashSync(password, 10);
        // console.log('Hashed password:', hashedPassword);
        // Check if the email is already registered
        const existingUser = yield userModel_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({ error: 'Email already exists' });
            return;
        }
        // Create a new user
        const newUser = new userModel_1.default({ username, email, password: hashedPassword });
        const savedUser = yield newUser.save();
        // generate and send an authentication token here, come back here for login
        res.status(201).json({ message: 'User registered successfully', user: savedUser });
    }
    catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate request body
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        const { email, password } = req.body;
        // Find the user by email
        const user = yield userModel_1.default.findOne({ email });
        // Check if the user exists
        if (!user) {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }
        // Compare passwords
        const passwordMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!passwordMatch) {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }
        // Passwords match, login successful
        const secretKey = process.env.SECRET;
        if (!secretKey) {
            throw new Error('SECRET key is not provided');
        }
        // Generate JWT token 
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, secretKey, { expiresIn: '5h' });
        // Exclude password field from user object in response/ sanitize
        const userWithoutPassword = Object.assign(Object.assign({}, user.toJSON()), { password: undefined });
        res.status(200).json({ message: 'Login successful', user: userWithoutPassword, token });
    }
    catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.loginUser = loginUser;
const followUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { followUserId } = req.body;
        // Check if the user to follow exists
        const userToFollow = yield userModel_1.default.findById(followUserId);
        if (!userToFollow) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        // Update the logged-in user's following list
        yield userModel_1.default.findByIdAndUpdate(userId, { $addToSet: { following: followUserId } });
        // Update the user being followed's followers list
        yield userModel_1.default.findByIdAndUpdate(followUserId, { $addToSet: { followers: userId } });
        res.status(200).json({ message: 'User followed successfully' });
    }
    catch (error) {
        console.error('Error following user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.followUser = followUser;
// Endpoint to unfollow a user
const unfollowUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        // Ensure the user is authenticated
        const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const { unfollowUserId } = req.body;
        // Validate the unfollowUserId
        if (!unfollowUserId) {
            res.status(400).json({ error: 'Unfollow user ID is required' });
            return;
        }
        // Check if the user to unfollow exists
        const userToUnfollow = yield userModel_1.default.findById(unfollowUserId);
        if (!userToUnfollow) {
            res.status(404).json({ error: 'User to unfollow not found' });
            return;
        }
        // Check if the logged-in user is actually following the user to unfollow
        if (!userToUnfollow.followers.includes(userId)) {
            res.status(400).json({ error: 'You are not following this user' });
            return;
        }
        // Update the logged-in user's following list
        const updatedUser = yield userModel_1.default.findByIdAndUpdate(userId, { $pull: { following: unfollowUserId } });
        if (!updatedUser) {
            res.status(500).json({ error: 'Failed to update following list' });
            return;
        }
        // Update the user being unfollowed's followers list
        const updatedUserToUnfollow = yield userModel_1.default.findByIdAndUpdate(unfollowUserId, { $pull: { followers: userId } });
        if (!updatedUserToUnfollow) {
            res.status(500).json({ error: 'Failed to update followers list of user to unfollow' });
            return;
        }
        res.status(200).json({ message: 'User unfollowed successfully' });
    }
    catch (error) {
        console.error('Error unfollowing user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.unfollowUser = unfollowUser;
const getFeed = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentUser = req.user; // Assuming you have authentication middleware
        const followingUsers = currentUser.following; // Assuming 'following' contains IDs of followed users
        // Query posts created by users whom the current user follows
        const feedPosts = yield postModel_1.default.find({ createdBy: { $in: followingUsers } });
        res.status(200).json({ message: 'Feed retrieved successfully', feedPosts });
    }
    catch (error) {
        console.error('Error fetching feed:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.getFeed = getFeed;
