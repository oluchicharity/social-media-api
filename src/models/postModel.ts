// postModel.ts
import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './userModel';

export interface Post extends Document {
  text: string;
  attachments?: string[]; // URLs of image/video attachments
  createdBy: IUser['_id'];
}

const postSchema: Schema = new Schema({
  text: { type: String, required: true },
  attachments: [{ type: String }],
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true } // Array of attachment URLs
});

export default mongoose.model<Post>('Post', postSchema);


