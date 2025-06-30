import { sendMessage } from "./controllers/messageController";
import dotenv from "dotenv";
import { app } from "./app";
import connectDB from "./db/db";
import { Server } from "socket.io";
import { User } from "./models/user.model";
import { Message, MessageDocument } from "./models/message.model";
import { Chat } from "./models/chat.model";

// Load environment variables
dotenv.config({ path: "./.env" });

const port = process.env.PORT || 8000;

// Start the server
export const server = app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

// Connect to the database
connectDB()
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((error) => {
    console.error("MONGO Connection Failed", error);
  });

// Socket connection
const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("init", (user) => {
    if (user && user._id) {
      socket.join(user._id);
      console.log("Connected", user);
      socket.emit("connected");
    } else {
      console.error("Invalid user data on init");
    }
  });

  socket.on("join_chat", (room) => {
    if (room && room._id) {
      socket.join(room._id);
      console.log("User joined room", room);
    } else {
      console.error("Invalid room data on join_chat");
    }
  });

  socket.on("new_message", async (newMessage) => {
    try {
      console.log(newMessage);

      const chat = newMessage?.msg?.chat;

      if (!chat || !Array.isArray(chat.users)) {
        return console.error("Chat or chat.users not defined or not an array");
      }

      const users = chat.users;
      const senderId = newMessage?.msg?.sender?._id;

      if (!senderId) {
        return console.error("Sender ID not defined");
      }

      const otherUser = users.find((user: any) => user._id !== senderId);

      if (!otherUser || !otherUser._id) {
        return console.error("Other user not found or user ID not defined");
      }

      const receiver = await User.findById(otherUser._id);

      if (!receiver) {
        return console.error("Receiver not found");
      }

      // Emit the original message to the chat room
      io.to(chat._id).emit("message_received", newMessage);
      console.log("Message emitted to", chat._id);

      // Check the receiver's status and send the "I am busy" response if necessary
      if (receiver.status === "busy") {
        console.log("Receiver is busy, sending busy message");
        const busyMessage = {
          sender: receiver._id,
          content: "I am busy",
          chat: chat,
        };

        // Creating the message in the database
        let msg = (await Message.create(busyMessage)) as MessageDocument;
        io.to(chat._id).emit("message_received", {
          msg: { content: "I am busy", chat: chat, sender: receiver },
        });
      }
    } catch (error) {
      console.error("Error in new_message handler:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});
