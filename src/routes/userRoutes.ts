// src/routes/userRoutes.ts
// src/routes/userRoutes.ts
import express from 'express';
import { registerUser } from '../controller/userController';
import { registerValidationRules } from '../validators/validators';

const router = express.Router();

router.post('/register', registerValidationRules(), registerUser);

export default router;

