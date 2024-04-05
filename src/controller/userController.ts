
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import User, { IUser } from '../models/userModel';
import bcrypt from 'bcrypt';

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return; // Return here to avoid executing further code
    }

    const { username, email, password } = req.body;

    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, 10);
    
   // console.log('Hashed password:', hashedPassword);

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ error: 'Email already exists' });
      return; // Return here to avoid executing further code
    }

    // Create a new user
    const newUser: IUser = new User({ username, email, password: hashedPassword });
    const savedUser = await newUser.save();
    
    // You may choose to generate and send an authentication token here, come back here for login
    
    res.status(201).json({ message: 'User registered successfully', user: savedUser });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



