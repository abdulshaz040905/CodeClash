import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import CodeEditor from "../components/Editor";

const socket = io("http://localhost:5000");

const Battle = () => {
  const roomId = "room1";

  const [user] = useState(
    "User_" + Math.floor(Math.random() * 1000)
  );

  const [winner, setWinner] = useState<string | null>(null);

  const [timeLeft, setTimeLeft] = useState<number>(300);

  const [battleEnded, setBattleEnded] =
    useState<boolean>(false);

  useEffect(() => {
    // Join room
    socket.emit("joinRoom", roomId);

    // Winner event
    socket.on("winner", (data) => {
      setWinner(data.winner);
    });

    // Timer event from backend
    socket.on("timerData", (data) => {
      const updateTimer = () => {
        const elapsed = Math.floor(
          (Date.now() - data.startTime) / 1000
        );

        const remaining =
          data.duration - elapsed;

        if (remaining <= 0) {
          setTimeLeft(0);
          setBattleEnded(true);
          return;
        }

        setTimeLeft(remaining);
      };

      updateTimer();

      const interval = setInterval(
        updateTimer,
        1000
      );

      return () => clearInterval(interval);
    });

    return () => {
      socket.off("winner");
      socket.off("timerData");
    };
  }, []);

  // Submit battle result
  const handleBattleSubmit = (
    success: boolean
  ) => {
    console.log("handleBattleSubmit")
    if (battleEnded) return;

    if (success) {
      socket.emit("submitResult", {
        roomId,
        success: true,
        user,
      });
    }
  };

  // Format timer
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);

    const secs = seconds % 60;

    return `${mins}:${secs
      .toString()
      .padStart(2, "0")}`;
  };
  return (
    <div style={{ padding: "20px" }}>
      <h1>⚔️ Battle Room</h1>

      <p>
        <strong>You are:</strong> {user}
      </p>

      <p>
        <strong>Room:</strong> {roomId}
      </p>

      {/* Timer */}
      <h2>
        ⏱️ Time Left:{" "}
        {formatTime(timeLeft)}
      </h2>

      {/* Battle ended */}
      {battleEnded && (
        <h2 style={{ color: "red" }}>
          ⌛ Battle Ended
        </h2>
      )}

      {/* Winner UI */}
      {winner && (
        <div
          style={{
            padding: "20px",
            marginBottom: "20px",
            border: "2px solid black",
          }}
        >
          {winner === user ? (
            <h2>🎉 You Won!</h2>
          ) : (
            <h2>
              😢 {winner} Won
            </h2>
          )}
        </div>
      )}

      {/* Code Editor */}
      <CodeEditor
        onBattleSubmit={
          handleBattleSubmit
        }
        battleEnded={battleEnded}
      />
    </div>
  );
};

export default Battle;