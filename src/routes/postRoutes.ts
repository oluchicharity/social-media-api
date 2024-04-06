import express from 'express'

import { createPost } from "../controller/postControlller"

import {authenticateUser } from '../middleware/middleware';


const router = express.Router();

router.post('/posts',authenticateUser,  createPost )



export default router;