
import express from 'express';
import { followUser, getFeed, loginUser, registerUser, unfollowUser } from '../controller/userController';
import { loginValidationRules, registerValidationRules } from '../validators/validators';
import {authenticateUser } from '../middleware/middleware';

const router = express.Router();

router.post('/register', registerValidationRules(), registerUser);

router.post("/login", loginValidationRules(), loginUser)

router.post("/follow", authenticateUser, followUser)

router.post('/unFollow', authenticateUser, unfollowUser)

router.get('/feed', authenticateUser, getFeed);



export default router;

