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
exports.default = router;
