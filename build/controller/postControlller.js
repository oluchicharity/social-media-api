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
exports.getPostDetails = exports.commentOnPost = exports.likePost = exports.createPost = void 0;
const postModel_1 = __importDefault(require("../models/postModel"));
const notificationController_1 = require("./notificationController");
const notificationController_2 = require("./notificationController");
const cloudinary_1 = require("cloudinary");
const userController_1 = require("./userController");
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if user is authenticated
        const user = req.user;
        if (!user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const { text } = req.body;
        let attachments = [];
        // Check if there are attachments in the request
        if (Array.isArray(req.files)) {
            attachments = yield uploadAttachments(req);
        }
        // Create a new post 
        const newPost = new postModel_1.default({ text, attachments, createdBy: user });
        const savedPost = yield newPost.save();
        // Get all users
        const allUsers = yield (0, userController_1.getAllUsers)();
        // Check if the post contains mentions and notify the mentioned users
        const mentionedUsers = (0, notificationController_1.extractMentionedUsers)(text, allUsers);
        for (const mentionedUser of mentionedUsers) {
            yield (0, notificationController_2.createNotification)(mentionedUser.id, 'mention', savedPost._id, user._id);
        }
        res.status(201).json({ message: 'Post created successfully', post: savedPost });
    }
    catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json(error.message);
    }
});
exports.createPost = createPost;
// Upload attachments to Cloudinary
const uploadAttachments = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const attachments = [];
    try {
        const files = req.files;
        if (!files || !Array.isArray(files) || files.length === 0) {
            console.error('No files found in request');
            return attachments;
        }
        for (const file of files) {
            // Upload file to Cloudinary
            const result = yield cloudinary_1.v2.uploader.upload(file.path);
            attachments.push(result.secure_url);
        }
    }
    catch (error) {
        console.error('Error uploading file(s) to Cloudinary:', error);
    }
    return attachments;
});
const likePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const postId = req.params.id;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        // Update post document to add user ID to likes array
        const updatedPost = yield postModel_1.default.findByIdAndUpdate(postId, { $addToSet: { likes: userId } }, { new: true });
        // Create a notification for the post owner
        const post = yield postModel_1.default.findById(postId);
        if (post) {
            yield (0, notificationController_2.createNotification)(post.createdBy, 'like', postId, userId);
        }
        res.status(200).json({ message: 'Post liked successfully', updatedPost });
    }
    catch (error) {
        console.error('Error liking post:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.likePost = likePost;
const commentOnPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const postId = req.params.id;
        const { text } = req.body;
        const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
        // Update post document to add comment object to comments array
        const updatedPost = yield postModel_1.default.findByIdAndUpdate(postId, { $push: { comments: { user: userId, text } } }, { new: true });
        // Create a notification for the post owner
        const post = yield postModel_1.default.findById(postId);
        if (post) {
            yield (0, notificationController_2.createNotification)(post.createdBy, 'comment', postId, userId);
        }
        res.status(200).json({ message: 'Comment added successfully', updatedPost });
    }
    catch (error) {
        console.error('Error commenting on post:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.commentOnPost = commentOnPost;
const getPostDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postId = req.params.id;
        const post = yield postModel_1.default.findById(postId);
        if (!post) {
            res.status(404).json({ error: 'Post not found' });
            return;
        }
        // Calculate number of likes and comments
        const numLikes = post.likes.length;
        const numComments = post.comments.length;
        // Return post details with number of likes and comments
        res.status(200).json({ post, numLikes, numComments });
    }
    catch (error) {
        console.error('Error fetching post details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.getPostDetails = getPostDetails;
// import { Request, Response } from 'express';
// import Post from '../models/postModel';
// import { AuthenticatedRequest } from '../middleware/middleware';
// import { uploadAttachments as uploadToCloudinary } from "../cloudinary" 
// import cloudinary, { v2 as cloudinaryV2 } from 'cloudinary'; 
// export const createPost = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
//   try {
//     // Check if user is authenticated
//     const user = req.user;
//     if (!user) {
//       res.status(401).json({ error: 'Unauthorized' });
//       return;
//     }
//     const { text } = req.body;
//     const attachments: string[] = await uploadAttachments(req); 
//     // Create a new post 
//     const newPost = new Post({ text, attachments, createdBy: user });
//     const savedPost = await newPost.save();
//     res.status(201).json({ message: 'Post created successfully', post: savedPost });
//   } catch (error) {
//     console.error('Error creating post:', error);
//     res.status(500).json(error);
//   }
// };
// // Upload attachments to Cloudinary
// const uploadAttachments = async (req: Request): Promise<string[]> => {
//   const attachments: string[] = [];
//   const files = req.files;
//   if (files && Array.isArray(files)) {
//     for (const file of files) {
//       // Upload file to Cloudinary
//       const result = await (cloudinaryV2.uploader as any).upload(file.path); // Use type assertion to access uploader
//       // Push the secure URL of the uploaded file to the attachments array
//       attachments.push(result.secure_url);
//     }
//   }
//   return attachments;
// };
