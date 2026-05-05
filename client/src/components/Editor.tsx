import Editor from "@monaco-editor/react";
import { useState } from "react";
import API from "../services/api";

type TestResult = {
  input: string;
  expected: string;
  output: string;
  passed: boolean;
};

type Props = {
  onBattleSubmit?: (success: boolean) => void;
  battleEnded?: boolean;
};

const CodeEditor = ({ onBattleSubmit, battleEnded }: Props) => {
  const [code, setCode] = useState<string>(
    `a, b = map(int, input().split())
print(a + b)`,
  );

  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const submitCode = async () => {
    // Prevent submit after battle end
    if (battleEnded) {
      alert("Battle has ended");
      return;
    }

    setLoading(true);

    try {
      const res = await API.post("/run/submit", {
        code,
        problemId: "69f5f7eb96935324167d9e3e",
      });

      setResults(res.data.results);

      // Notify battle page
      if (onBattleSubmit) {
        onBattleSubmit(res.data.success);
      }
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div>
      {/* Monaco Editor */}
      <div
        style={{
          height: "400px",
          border: "1px solid gray",
        }}
      >
        <Editor
          height="100%"
          defaultLanguage="python"
          theme="vs-dark"
          value={code}
          onChange={(value) => setCode(value || "")}
        />
      </div>

      {/* Submit Button */}
      <button
        onClick={submitCode}
        disabled={loading || battleEnded}
        style={{
          marginTop: "10px",
          padding: "10px 20px",
          cursor: battleEnded ? "not-allowed" : "pointer",
        }}
      >
        {battleEnded ? "Battle Ended" : "Submit Code"}
      </button>

      {/* Loading */}
      {loading && <p>Running...</p>}

      {/* Results */}
      <div style={{ marginTop: "20px" }}>
        {results.map((r, index) => (
          <div
            key={index}
            style={{
              border: "1px solid gray",
              padding: "10px",
              marginBottom: "10px",
              backgroundColor: r.passed ? "#d4edda" : "#f8d7da",
            }}
          >
            <p>
              <strong>Input:</strong> {r.input}
            </p>

            <p>
              <strong>Expected:</strong> {r.expected}
            </p>

            <p>
              <strong>Your Output:</strong> {r.output}
            </p>

            <p>
              <strong>Status:</strong> {r.passed ? "✅ Passed" : "❌ Failed"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CodeEditor;
