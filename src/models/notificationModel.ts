
import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  recipient: string;
  type: 'mention' | 'like' | 'comment' | 'follow';
  postId?: string;
  sender: string;
  read: boolean;
  createdAt: Date;
}

const NotificationSchema: Schema = new Schema({
  recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['mention', 'like', 'comment', 'follow'], required: true },
  postId: { type: Schema.Types.ObjectId, ref: 'Post' },
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<INotification>('Notification', NotificationSchema);

