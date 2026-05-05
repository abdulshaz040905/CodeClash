import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import CodeEditor from "../components/Editor";

const socket = io("http://localhost:5000");

const Battle = () => {
  const [roomId, setRoomId] = useState("room1");
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    socket.emit("joinRoom", roomId);

    socket.on("update", (data) => {
      setMessages((prev) => [...prev, data.message]);
    });

    return () => {
      socket.off("update");
    };
  }, []);

  const sendUpdate = () => {
    socket.emit("submitCode", {
      roomId,
      message: "User submitted code!",
    });
  };

  return (
    <div>
      <h1>1v1 Battle</h1>

      <button onClick={sendUpdate}>Simulate Submit</button>

      <CodeEditor />

      <h3>Live Updates:</h3>
      {messages.map((msg, i) => (
        <p key={i}>{msg}</p>
      ))}
    </div>
  );
};

export default Battle;