"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const postControlller_1 = require("../controller/postControlller");
const middleware_1 = require("../middleware/middleware");
const router = express_1.default.Router();
router.post('/posts', middleware_1.authenticateUser, postControlller_1.createPost);
router.post('/:id/like', middleware_1.authenticateUser, postControlller_1.likePost);
router.post('/:id/comment', middleware_1.authenticateUser, postControlller_1.commentOnPost);
router.get('/:id', middleware_1.authenticateUser, postControlller_1.getPostDetails);
exports.default = router;
