import { Request, Response } from 'express';
import Post from '../models/postModel';
import { AuthenticatedRequest } from '../middleware/middleware';
import { uploadAttachments as uploadToCloudinary } from "../cloudinary" 

import cloudinary, { v2 as cloudinaryV2 } from 'cloudinary'; 

export const createPost = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    // Check if user is authenticated
    const user = req.user;
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { text } = req.body;
    const attachments: string[] = await uploadAttachments(req); 

    // Create a new post 
    const newPost = new Post({ text, attachments, createdBy: user });
    const savedPost = await newPost.save();

    res.status(201).json({ message: 'Post created successfully', post: savedPost });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Upload attachments to Cloudinary
const uploadAttachments = async (req: Request): Promise<string[]> => {
  const attachments: string[] = [];
  const files = req.files;

  if (!files || !Array.isArray(files)) {
    console.error('No files found in request');
    return attachments;
  }

  for (const file of files) {
    try {
      // Upload file to Cloudinary
      const result = await (cloudinaryV2.uploader as any).upload(file.path); // Use type assertion to access uploader
      // Push the secure URL of the uploaded file to the attachments array
      attachments.push(result.secure_url);
    } catch (error) {
      console.error('Error uploading file to Cloudinary:', error);
    }
  }

  return attachments;
};









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