"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controller/userController");
const validators_1 = require("../validators/validators");
const middleware_1 = require("../middleware/middleware");
const router = express_1.default.Router();
router.post('/register', (0, validators_1.registerValidationRules)(), userController_1.registerUser);
router.post("/login", (0, validators_1.loginValidationRules)(), userController_1.loginUser);
router.post("/follow", middleware_1.authenticateUser, userController_1.followUser);
router.post('/unFollow', middleware_1.authenticateUser, userController_1.unfollowUser);
router.get('/feed', middleware_1.authenticateUser, userController_1.getFeed);
exports.default = router;
