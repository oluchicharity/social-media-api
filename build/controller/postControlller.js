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
exports.createPost = void 0;
const postModel_1 = __importDefault(require("../models/postModel"));
const cloudinary_1 = require("cloudinary");
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if user is authenticated
        const user = req.user;
        if (!user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const { text } = req.body;
        const attachments = yield uploadAttachments(req);
        // Create a new post 
        const newPost = new postModel_1.default({ text, attachments, createdBy: user });
        const savedPost = yield newPost.save();
        res.status(201).json({ message: 'Post created successfully', post: savedPost });
    }
    catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.createPost = createPost;
// Upload attachments to Cloudinary
const uploadAttachments = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const attachments = [];
    const files = req.files;
    if (!files || !Array.isArray(files)) {
        console.error('No files found in request');
        return attachments;
    }
    for (const file of files) {
        try {
            // Upload file to Cloudinary
            const result = yield cloudinary_1.v2.uploader.upload(file.path); // Use type assertion to access uploader
            // Push the secure URL of the uploaded file to the attachments array
            attachments.push(result.secure_url);
        }
        catch (error) {
            console.error('Error uploading file to Cloudinary:', error);
        }
    }
    return attachments;
});
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
