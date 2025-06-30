import express from "express";
import { LIMIT } from "./constants";
import cors from "cors";
import userRouter from "./routes/user.route";
import chatRouter from "./routes/chat.route";
import messageRouter from "./routes/message.route";

export const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  })
);
app.use(express.json({ limit: LIMIT }));
app.use(express.urlencoded({ extended: true, limit: LIMIT }));

app.use("/api/v1/users", userRouter);
app.use("/api/v1/chat", chatRouter);
app.use("/api/v1/message", messageRouter);

app.get("/", (req, res) => {
  res.send("Hello World! This is a test server for the API.");
});
