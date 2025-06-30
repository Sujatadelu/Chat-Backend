import mongoose, { Schema, Document, Mongoose } from "mongoose";

export interface UserDocument extends Document {
  _id: string;
  email: string;
  name: string;
  password: string;
  profilePicture?: string;
  status: "busy" | "available";
}

const userSchema = new Schema<UserDocument>(
  {
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, "fullname is required"],
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    profilePicture: {
      type: String,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    status: {
      type: String,
      enum: ["busy", "available"],
      default: "available",
    },
  },
  { timestamps: true }
);

export const User = mongoose.model<UserDocument>("User", userSchema);
