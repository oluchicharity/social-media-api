import { Request, Response, NextFunction } from 'express';
import jwt, { TokenExpiredError } from 'jsonwebtoken';
import User, { IUser } from '../models/userModel'; 
import dotenv from 'dotenv';

dotenv.config();

export interface AuthenticatedRequest extends Request {
  user?: IUser; 
}

export const authenticateUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    // Extract the JWT token from the Authorization header
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      return res.status(401).json({ error: 'Authorization header missing' });
    }
    const token = authorizationHeader.split(' ')[1];

    // Verify the JWT token
    const secretKey = process.env.SECRET;
    if (!secretKey) {
      return res.status(500).json({ error: ' SECRET key is not provided' });
    }
    const decodedToken = jwt.verify(token, secretKey) as { userId: string }; 
    if (!decodedToken) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Fetch user from database 
    const user = await User.findById(decodedToken.userId); 
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Attach the user object to the request
    req.user = user;

    // Call the next middleware
    next();
  } catch (error: any) { 
    console.error('Authentication error:', error.message);

    // Handle TokenExpiredError separately
    if (error instanceof TokenExpiredError) {
      return res.status(401).json({ error: 'Token has expired' });
    }

    // Handle other errors
    return res.status(500).json(error.message);
  }
};
