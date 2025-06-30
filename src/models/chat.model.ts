import mongoose, { Schema, Document, Model } from "mongoose";

export interface ChatDocument extends Document {
  chatName: string;
  latestMessage: mongoose.Types.ObjectId | null;
  users: [mongoose.Types.ObjectId];
}

export type ChatModel = Model<ChatDocument>;

const ChatSchema = new Schema<ChatDocument>(
  {
    chatName: {
      type: String,
      trim: true,
      required: [true, "Chat name field is required."],
    },
    latestMessage: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Message",
    },
    users: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Chat: ChatModel = mongoose.model<ChatDocument, ChatModel>(
  "Chat",
  ChatSchema
);
