
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import User, { IUser } from '../models/userModel';
import Post from "../models/postModel"
import { createNotification } from './notificationController';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { promises } from 'dns';
dotenv.config()


export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return; 
    }

    const { username, email, password } = req.body;

    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, 10);
    
   // console.log('Hashed password:', hashedPassword);

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ error: 'Email already exists' });
      return; 
    }

    // Create a new user
    const newUser: IUser = new User({ username, email, password: hashedPassword });
    const savedUser = await newUser.save();
    
  // generate and send an authentication token here, come back here for login
    
    res.status(201).json({ message: 'User registered successfully', user: savedUser });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
      // Validate request body
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return; 
      }
  
      const { email, password } = req.body;
  
      // Find the user by email
      const user: IUser | null = await User.findOne({ email });
  
      // Check if the user exists
      if (!user) {
        res.status(401).json({ error: 'Invalid email or password' });
        return;
      }
  
      // Compare passwords
      const passwordMatch = await bcrypt.compare(password, user.password);
  
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
    const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '5h' });

      // Exclude password field from user object in response/ sanitize
      const userWithoutPassword = { ...user.toJSON(), password: undefined };
  
      res.status(200).json({ message: 'Login successful', user: userWithoutPassword, token });
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

export const getOne = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.id;

        // Query the database for the user by ID
        const user: IUser | null = await User.findById(userId);

        // Check if the user exists
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return; 
        }

        // If user found, send it in the response
        res.status(200).json({ user });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


  export const getAllUsers = async (): Promise<IUser[]> => {
      try {
          const allUsers: IUser[] = await User.find();
          return allUsers;
      } catch (error) {
          console.error('Error retrieving all users:', error);
          throw new Error('Failed to retrieve all users');
      }
  };
  
  
export interface AuthenticatedRequest extends Request {
    user?: IUser; 
  }

 
  export const followUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
      try {
          const userId = req.user?.id; 
          const { followUserId } = req.body; 
  
          // Check if the user to follow exists
          const userToFollow = await User.findById(followUserId);
          if (!userToFollow) {
              res.status(404).json({ error: 'User not found' });
              return;
          }
  
          // Update the logged-in user's following list
          await User.findByIdAndUpdate(userId, { $addToSet: { following: followUserId } });
  
          // Update the user being followed's followers list
          await User.findByIdAndUpdate(followUserId, { $addToSet: { followers: userId } });
  
          // Create a notification for the user being followed
          await createNotification(followUserId, 'follow', undefined, userId);
  
          res.status(200).json({ message: 'User followed successfully' });
      } catch (error) {
          console.error('Error following user:', error);
          res.status(500).json({ error: 'Internal Server Error' });
      }
  };
  




// Endpoint to unfollow a user
export const unfollowUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        // Ensure the user is authenticated
        const userId = req.user?.id;
        if (!userId) {
             res.status(401).json({ error: 'Unauthorized' });
             return
        }

        const { unfollowUserId } = req.body;

        // Validate the unfollowUserId
        if (!unfollowUserId) {
         res.status(400).json({ error: 'Unfollow user ID is required' });
         return
        }

        // Check if the user to unfollow exists
        const userToUnfollow = await User.findById(unfollowUserId);
        if (!userToUnfollow) {
            res.status(404).json({ error: 'User to unfollow not found' });
            return
        }

        // Check if the logged-in user is following the user to unfollow
        if (!userToUnfollow.followers.includes(userId)) {
             res.status(400).json({ error: 'You are not following this user' });
             return
        }

        // Update the logged-in user's following list
        const updatedUser = await User.findByIdAndUpdate(userId, { $pull: { following: unfollowUserId } });
        if (!updatedUser) {
             res.status(500).json({ error: 'Failed to update following list' });
             return
        }

        // Update the user being unfollowed's followers list
        const updatedUserToUnfollow = await User.findByIdAndUpdate(unfollowUserId, { $pull: { followers: userId } });
        if (!updatedUserToUnfollow) {
             res.status(500).json({ error: 'Failed to update followers list of user to unfollow' });
             return
        }

        res.status(200).json({ message: 'User unfollowed successfully' });
    } catch (error) {
        console.error('Error unfollowing user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};




export const getFeed = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const currentUser = req.user as IUser;
    const followingUsers = currentUser.following;

    const page = parseInt(req.query.page as string) || 1; 
    const limit = parseInt(req.query.limit as string) || 10; 

    // Calculate the skip value
    const skip = (page - 1) * limit;

    // Query posts with pagination
    const feedPosts = await Post.find({ createdBy: { $in: followingUsers } })
                                 .skip(skip)
                                 .limit(limit)
                                 .sort({ createdAt: -1 }); // Sort by createdAt in descending order

    res.status(200).json({ message: 'Feed retrieved successfully', feedPosts });
  } catch (error) {
    console.error('Error fetching feed:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


