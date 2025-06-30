import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { accessChats, fetchChats } from "../controllers/chatController";

const router = Router();

router
  .route("/")
  .post(authMiddleware, accessChats)
  .get(authMiddleware, fetchChats);

export default router;
