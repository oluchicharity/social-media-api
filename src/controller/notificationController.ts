import Notification, { INotification } from '../models/notificationModel';

import { IUser } from '../models/userModel';

// Function to create a new notification
export const createNotification = async (
  recipientId: string,
  type: 'mention' | 'like' | 'comment' | 'follow',
  postId?: string,
  senderId?: string
): Promise<INotification> => {
  try {
    // Create a new notification object
    const notification = new Notification({
      recipient: recipientId,
      type,
      postId,
      sender: senderId,
      read: false,
    });

    // Save the notification to the database
    const newNotification = await notification.save();

    return newNotification;
  } catch (error: any) {
 
    throw new Error(`Failed to create notification: ${error.message}`);
  }
};


export const extractMentionedUsers = (text: string, allUsers: IUser[]): IUser[] => {
  const mentionedUsers: IUser[] = [];

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
