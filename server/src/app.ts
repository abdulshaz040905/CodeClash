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
const roomTimers: Record<
  string,
  {
    startTime: number;
    duration: number;
  }
> = {};

let waitingPlayer: string | null = null;
// 🧠 SOCKET LOGIC
io.on("connection", (socket) => {

  socket.on("findMatch", () => {
  console.log("Player searching:", socket.id);

  // No waiting player
  if (!waitingPlayer) {
    waitingPlayer = socket.id;

    socket.emit("waiting");
  } else {
    // Create random room
    const roomId =
      "room_" + Math.random().toString(36).substring(7);

    // Join both players
    socket.join(roomId);

    io.sockets.sockets
      .get(waitingPlayer)
      ?.join(roomId);

    // Send room to both players
    socket.emit("matchFound", roomId);

    io.to(waitingPlayer).emit(
      "matchFound",
      roomId
    );

    console.log(
      `Match created: ${roomId}`
    );

    waitingPlayer = null;
  }
});

  socket.on("joinRoom", (roomId) => {
  socket.join(roomId);

  console.log(`User joined room: ${roomId}`);

  // Create timer if room doesn't exist
  if (!roomTimers[roomId]) {
    roomTimers[roomId] = {
      startTime: Date.now(),
      duration: 300, // 5 minutes
    };
  }

  // Send timer info to frontend
  socket.emit("timerData", roomTimers[roomId]);
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