import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useNavigate } from "react-router-dom";

const Matchmaking = () => {
  const [status, setStatus] = useState(
    "Searching for player..."
  );

  const navigate = useNavigate();

  useEffect(() => {
    // Create socket INSIDE effect
    const socket: Socket = io(
      "http://localhost:5000"
    );

    // Ask backend for match
    socket.emit("findMatch");

    // Waiting event
    socket.on("waiting", () => {
      setStatus("Waiting for opponent...");
    });

    // Match found
    socket.on("matchFound", (roomId) => {
      setStatus("Match Found!");

      console.log("Room:", roomId);

      navigate(`/battle/${roomId}`);
    });

    // Cleanup
    return () => {
      socket.off("waiting");
      socket.off("matchFound");

      socket.disconnect();
    };
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>🎯 Matchmaking</h1>

      <h2>{status}</h2>
    </div>
  );
};

export default Matchmaking;