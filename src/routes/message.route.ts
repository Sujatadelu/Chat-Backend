import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { allMessages, sendMessage } from "../controllers/messageController";

const router = Router();

router
  .post("/", authMiddleware, sendMessage)
  .get("/:chatId", authMiddleware, allMessages);

export default router;
