// import express, { Request, Response } from 'express';
// import multer from 'multer';
// // import cloudinary from 'cloudinary';
// import { CloudinaryStorage } from 'multer-storage-cloudinary';

//  require("dotenv").config();

// // // Configure Cloudinary
// // cloudinary.v2.config({ 
// //     cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
// //     api_key: process.env.CLOUDINARY_API_KEY, 
// //     api_secret: process.env.CLOUDINARY_API_SECRET 
// // });

// // const storage = new CloudinaryStorage({
// //     cloudinary: cloudinary.v2,
// //     params: {
// //       folder: 'posts', 
// //       allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'mp4'] 
// //     } as any // Type assertion to bypass type checking
// //   });

// // const upload = multer({ storage });

// // export { cloudinary, upload };


// // Import the Cloudinary module and necessary types
// import cloudinary, { UploadApiResponse } from 'cloudinary';

// // Configure Cloudinary
// cloudinary.v2.config({ 
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
//     api_key: process.env.CLOUDINARY_API_KEY, 
//     api_secret: process.env.CLOUDINARY_API_SECRET 
// });

// export const uploadAttachments = async (files: Express.Multer.File[]): Promise<string[]> => {
//   const attachments: string[] = [];

//   for (const file of files) {
//     // Upload each file to Cloudinary
//     const result: UploadApiResponse = await cloudinary.v2.uploader.upload(file.path);
//     // Push the secure URL of the uploaded file to the attachments array
//     attachments.push(result.secure_url);
//   }

//   return attachments;
// };


import multer from 'multer';
import cloudinary, { UploadApiResponse } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary
cloudinary.v2.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

// Set up Multer for handling file uploads
const upload = multer({ dest: 'uploads/' });

export const uploadAttachments = async (files: Express.Multer.File[]): Promise<string[]> => {
  const attachments: string[] = [];

  for (const file of files) {
    try {
      // Check if file size exceeds limit (in bytes)
      const fileSizeLimit = 5 * 1024 * 1024; // 5mb
      if (file.size > fileSizeLimit) {
        throw new Error('File size exceeds the maximum limit');
      }

      const result: UploadApiResponse = await cloudinary.v2.uploader.upload(file.path);
      attachments.push(result.secure_url);
    } catch (error) {
      console.error('Error uploading file to Cloudinary:', error);
      
      throw new Error('Failed to upload file to Cloudinary');
    }
  }

  return attachments;
};
