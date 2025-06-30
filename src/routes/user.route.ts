import { authMiddleware } from "./../middleware/auth.middleware";
import {
  allUsers,
  loginController,
  registerController,
  toggleStatus,
} from "./../controllers/userController";
import { Router } from "express";

const router = Router();

router
  .post("/sign-up", registerController)
  .post("/login", loginController)
  .put("/status", authMiddleware, toggleStatus)
  .get("/", authMiddleware, allUsers);

export default router;
