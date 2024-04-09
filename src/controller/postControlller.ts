
import { Request, Response } from 'express';
import Post from '../models/postModel';
import { AuthenticatedRequest } from '../middleware/middleware';
import { uploadAttachments as uploadToCloudinary } from "../cloudinary";
import { extractMentionedUsers } from './notificationController';
import { createNotification } from './notificationController'; 
import cloudinary, { v2 as cloudinaryV2 } from 'cloudinary'; 
import { getAllUsers } from './userController'; 


export const createPost = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    // Check if user is authenticated
    const user = req.user;
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { text } = req.body;
    let attachments: string[] = [];
    
    // Check if there are attachments in the request
    if (Array.isArray(req.files)) {
      attachments = await uploadAttachments(req);
    }

    // Create a new post 
    const newPost = new Post({ text, attachments, createdBy: user });
    const savedPost = await newPost.save();

    // Get all users
    const allUsers = await getAllUsers();

    // Check if the post contains mentions and notify the mentioned users
    const mentionedUsers = extractMentionedUsers(text, allUsers);
    for (const mentionedUser of mentionedUsers) {
      await createNotification(mentionedUser.id, 'mention', savedPost._id, user._id);
    }

    res.status(201).json({ message: 'Post created successfully', post: savedPost });
  } catch (error:any) {
    console.error('Error creating post:', error);
    res.status(500).json(error.message);
  }
};
// Upload attachments to Cloudinary
const uploadAttachments = async (req: Request): Promise<string[]> => {
  const attachments: string[] = [];

  try {
    const files = req.files;
    if (!files || !Array.isArray(files) || files.length === 0) {
      console.error('No files found in request');
      return attachments;
    }

    for (const file of files) {
      // Upload file to Cloudinary
      const result = await cloudinaryV2.uploader.upload(file.path);
      attachments.push(result.secure_url);
    }
  } catch (error) {
    console.error('Error uploading file(s) to Cloudinary:', error);
  }

  return attachments;
};



export const likePost = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const postId = req.params.id; 
    const userId = req.user?.id; 

    // Update post document to add user ID to likes array
    const updatedPost = await Post.findByIdAndUpdate(postId, { $addToSet: { likes: userId } }, { new: true });

    // Create a notification for the post owner
    const post = await Post.findById(postId);
    if (post) {
      await createNotification(post.createdBy, 'like', postId, userId);
    }

    res.status(200).json({ message: 'Post liked successfully', updatedPost });
  } catch (error) {
    console.error('Error liking post:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



export const commentOnPost = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const postId = req.params.id; 
    const { text } = req.body; 
    const userId = req.user?.id; 

    // Update post document to add comment object to comments array
    const updatedPost = await Post.findByIdAndUpdate(
      postId, 
      { $push: { comments: { user: userId, text } } }, 
      { new: true }
    );

    // Create a notification for the post owner
    const post = await Post.findById(postId);
    if (post) {
      await createNotification(post.createdBy, 'comment', postId, userId);
    }

    res.status(200).json({ message: 'Comment added successfully', updatedPost });
  } catch (error) {
    console.error('Error commenting on post:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};




export const getPostDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const postId = req.params.id; 

    const post = await Post.findById(postId);

    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    // Calculate number of likes and comments
    const numLikes = post.likes.length;
    const numComments = post.comments.length;

    // Return post details with number of likes and comments
    res.status(200).json({ post, numLikes, numComments });
  } catch (error) {
    console.error('Error fetching post details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
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