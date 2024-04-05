"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/userRoutes.ts
// src/routes/userRoutes.ts
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controller/userController");
const validators_1 = require("../validators/validators");
const router = express_1.default.Router();
router.post('/register', (0, validators_1.registerValidationRules)(), userController_1.registerUser);
exports.default = router;
