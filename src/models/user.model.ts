import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  googleId?: string;
  otp?: string; // Store the OTP
  otpExpires?: Date;
  active:boolean // Store the OTP expiration time
}

const UserSchema = new Schema<IUser>({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  googleId: { type: String },
  otp: { type: String }, // OTP field
  otpExpires: { type: Date },
  active:{type:Boolean,default:true} // OTP expiration field
});

export default mongoose.model<IUser>("User", UserSchema);