// src/validators/registerValidator.ts
import { body } from 'express-validator';

export const registerValidationRules = () => {
  return [
    body('username').notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
  ];
};