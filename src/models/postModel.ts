
import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './userModel';

export interface Post extends Document {
  text: string;
  attachments?: string[]; 
  createdBy: IUser['_id'],
  likes: string[]; 
  comments: { user: string; text: string }[];
}

const postSchema: Schema = new Schema({
  text: { type: String, required: true },
  attachments: [{ type: String }],
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true } ,
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  comments: [{ user: { type: Schema.Types.ObjectId, ref: 'User' }, text: String }]
}, { timestamps: true });


export default mongoose.model<Post>('Post', postSchema);


