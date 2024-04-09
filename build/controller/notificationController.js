"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractMentionedUsers = exports.createNotification = void 0;
const notificationModel_1 = __importDefault(require("../models/notificationModel"));
// Function to create a new notification
const createNotification = (recipientId, type, postId, senderId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Create a new notification object
        const notification = new notificationModel_1.default({
            recipient: recipientId,
            type,
            postId,
            sender: senderId,
            read: false,
        });
        // Save the notification to the database
        const newNotification = yield notification.save();
        return newNotification;
    }
    catch (error) {
        throw new Error(`Failed to create notification: ${error.message}`);
    }
});
exports.createNotification = createNotification;
const extractMentionedUsers = (text, allUsers) => {
    const mentionedUsers = [];
    const mentions = text.match(/@(\w+)/g);
    if (mentions) {
        for (const mention of mentions) {
            const username = mention.substring(1); // Remove '@' from the mention
            const mentionedUser = allUsers.find(user => user.username === username);
            if (mentionedUser) {
                mentionedUsers.push(mentionedUser);
            }
        }
    }
    return mentionedUsers;
};
exports.extractMentionedUsers = extractMentionedUsers;
