// src/routes/userRoutes.ts
// src/routes/userRoutes.ts
import express from 'express';
import { loginUser, registerUser } from '../controller/userController';
import { loginValidationRules, registerValidationRules } from '../validators/validators';

const router = express.Router();

router.post('/register', registerValidationRules(), registerUser);

router.post("/login", loginValidationRules, loginUser)

export default router;

