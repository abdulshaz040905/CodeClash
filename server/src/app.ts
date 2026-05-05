import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import http from "http";
import { Server } from "socket.io";

import problemRoutes from "./routes/problemRoutes";
import runRoutes from "./routes/runRoutes";

const app = express();

app.use(cors());
app.use(express.json());

// DB
mongoose
  .connect("mongodb://127.0.0.1:27017/codearena")
  .then(() => console.log("DB connected"))
  .catch((err) => console.log(err));

// Routes
app.use("/api/problems", problemRoutes);
app.use("/api/run", runRoutes);

// Create HTTP server
const server = http.createServer(app);

// Attach Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
const roomWinners: Record<string, string> = {};
// 🧠 SOCKET LOGIC
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  });

  socket.on("submitResult", (data) => {
    const { roomId, success, user } = data;

    console.log("Received submit:", data);

    // If winner already exists → ignore
    if (roomWinners[roomId]) {
      console.log("Winner already declared");
      return;
    }

    if (success) {
      roomWinners[roomId] = user;

      console.log("Winner:", user);

      io.to(roomId).emit("winner", {
        winner: user,
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});