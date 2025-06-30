import { Chat } from "./../models/chat.model";
import { MessageDocument } from "./../models/message.model";
import { Request, Response } from "express";
import { sendMessageRequestBodySchema } from "../utils/zod-schema";
import { Message } from "../models/message.model";
import { User } from "../models/user.model";

export const sendMessage = async (req: Request, res: Response) => {
  try {
    // For zod validation
    const body = await sendMessageRequestBodySchema.parseAsync(req.body);
    const { content, chatId } = body;

    // Creating a message to store in the database
    const newMessage = {
      sender: req.user?._id,
      content,
      chat: chatId,
    };

    // Creating the message in the database
    let msg = (await Message.create(newMessage)) as MessageDocument;
    let messages = msg;
    // Populating the sender and chat fields
    msg = await msg.populate("sender", "name profilePicture");
    msg = await msg.populate("chat");

    // Populating the users within the chat
    msg = (await User.populate(msg, {
      path: "chat.users",
      select: "name profilePicture email",
    })) as any;

    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: msg,
    });

    // Sending the populated message as response
    res.status(200).json({ message: "Message sent", msg });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const allMessages = async (req: Request, res: Response) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name profilePicture email")
      .populate("chat");
    res.status(200).json({ messages });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
