import express from 'express'

import { commentOnPost, createPost, getPostDetails, likePost } from "../controller/postControlller"

import {authenticateUser } from '../middleware/middleware';


const router = express.Router();

router.post('/posts',authenticateUser,  createPost )

router.post('/:id/like', authenticateUser, likePost)

router.post('/:id/comment', authenticateUser, commentOnPost);

router.get('/:id', authenticateUser, getPostDetails);


export default router;