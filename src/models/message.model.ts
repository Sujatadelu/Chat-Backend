import mongoose, { Schema, Document } from "mongoose";

export interface MessageDocument extends Document {
  sender: mongoose.Types.ObjectId;
  content: String;
  chat: mongoose.Types.ObjectId;
}

const messageSchema = new Schema<MessageDocument>(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    content: {
      type: String,
      trim: true,
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
    },
  },
  { timestamps: true }
);

export const Message = mongoose.model<MessageDocument>(
  "Message",
  messageSchema
);
