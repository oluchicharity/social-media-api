
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import User, { IUser } from '../models/userModel';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
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
    const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' });

      // Exclude password field from user object in response/ sanitize
      const userWithoutPassword = { ...user.toJSON(), password: undefined };
  
      res.status(200).json({ message: 'Login successful', user: userWithoutPassword, token });
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  

  


