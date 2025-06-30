import { Request, Response } from "express";
import { accessChatsRequestBodySchema } from "../utils/zod-schema";
import { Chat, ChatDocument } from "../models/chat.model";
import { User, UserDocument } from "../models/user.model";

export const accessChats = async (req: Request, res: Response) => {
  try {
    // Validate request body using Zod schema
    const body = await accessChatsRequestBodySchema.parseAsync(req.body);
    const { userId } = body;
    console.log(userId);

    // Find the chat between the current user and the specified user
    let isChat: ChatDocument | null = await Chat.findOne({
      $or: [
        { users: { $all: [req?.user?._id, userId] } },
        { users: { $all: [userId, req?.user?._id] } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");

    console.log(isChat);

    // Populate the sender information for the latest message
    if (isChat) {
      isChat = await isChat.populate(
        "latestMessage.sender",
        "name profilePicture email"
      );

      res.send(isChat);
    } else {
      // If no chat exists, create a new chat

      const chatData = {
        chatName: "sender",
        users: [req?.user?._id, userId],
      };

      const createdChat = await Chat.create(chatData);
      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).send(fullChat);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const fetchChats = async (req: Request, res: Response) => {
  try {
    const chat: ChatDocument[] = await Chat.find({
      users: { $elemMatch: { $eq: req?.user?._id } },
    })
      .populate("users", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    const result = await User.populate(chat, {
      path: "latestMessage.sender",
      select: "name profilePicture email",
    });

    if (result.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No chats found for the user." });
    }
    res.json({ success: true, data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
