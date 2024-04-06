// userModel.ts

import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string,
  followers: string[]; 
  following: string[];
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  followers: [{ type: Schema.Types.ObjectId, ref: 'User' }], 
  following: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

export default mongoose.model<IUser>('User', UserSchema);
