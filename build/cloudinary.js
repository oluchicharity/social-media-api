"use strict";
// import express, { Request, Response } from 'express';
// import multer from 'multer';
// // import cloudinary from 'cloudinary';
// import { CloudinaryStorage } from 'multer-storage-cloudinary';
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
exports.uploadAttachments = void 0;
const cloudinary_1 = __importDefault(require("cloudinary"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Configure Cloudinary
cloudinary_1.default.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
const uploadAttachments = (files) => __awaiter(void 0, void 0, void 0, function* () {
    const attachments = [];
    for (const file of files) {
        try {
            const result = yield cloudinary_1.default.v2.uploader.upload(file.path);
            attachments.push(result.secure_url);
        }
        catch (error) {
            console.error('Error uploading file to Cloudinary:', error);
            throw new Error('Failed to upload file to Cloudinary');
        }
    }
    return attachments;
});
exports.uploadAttachments = uploadAttachments;
