import { accessChats } from "./../controllers/chatController";
import { z } from "zod";

export const RegisterRequestBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  profilePicture: z.string().url().optional(),
});

export const LoginRequestBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const accessChatsRequestBodySchema = z.object({
  userId: z.string(),
});

export const sendMessageRequestBodySchema = z.object({
  content: z.string(),
  chatId: z.string(),
});
