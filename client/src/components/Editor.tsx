import Editor from "@monaco-editor/react";
import { useState } from "react";
import API from "../services/api";

type TestResult = {
  input: string;
  expected: string;
  output: string;
  passed: boolean;
};

const CodeEditor = () => {
  const [code, setCode] = useState<string>(
`a, b = map(int, input().split())
print(a + b)`
  );

  const [output, setOutput] = useState<string>("");
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // 🔹 RUN CODE (simple execution)
  const runCode = async () => {
    setLoading(true);
    setOutput("");
    try {
      const res = await API.post("/run", { code });
      setOutput(res.data.output || res.data.error);
    } catch (err) {
      setOutput("Error running code");
    }
    setLoading(false);
  };

  // 🔹 SUBMIT CODE (judge system)
  const submitCode = async () => {
    setLoading(true);
    setResults([]);

    try {
      const res = await API.post("/run/submit", {
        code,
        problemId: "69f75466676fc59bf3b4e489",
      });

      setResults(res.data.results);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Code Editor</h2>

      {/* 🧠 Editor */}
      <div style={{ height: "400px", border: "1px solid #ccc" }}>
        <Editor
          height="100%"
          defaultLanguage="python"
          theme="vs-dark"
          value={code}
          onChange={(value) => setCode(value || "")}
        />
      </div>

      {/* ⚡ Buttons */}
      <div style={{ marginTop: "10px" }}>
        <button onClick={runCode} disabled={loading}>
          Run Code
        </button>

        <button onClick={submitCode} disabled={loading} style={{ marginLeft: "10px" }}>
          Submit
        </button>
      </div>

      {/* 🔄 Loading */}
      {loading && <p>Running...</p>}

      {/* 📤 Output */}
      {output && (
        <div style={{ marginTop: "20px" }}>
          <h3>Output:</h3>
          <pre>{output}</pre>
        </div>
      )}

      {/* 🧪 Test Case Results */}
      {results.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3>Test Results:</h3>

          {results.map((r, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #ddd",
                padding: "10px",
                marginBottom: "10px",
                backgroundColor: r.passed ? "#d4edda" : "#f8d7da",
              }}
            >
              <p><strong>Input:</strong> {r.input}</p>
              <p><strong>Expected:</strong> {r.expected}</p>
              <p><strong>Your Output:</strong> {r.output}</p>
              <p>
                <strong>Status:</strong>{" "}
                {r.passed ? "✅ Passed" : "❌ Failed"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CodeEditor;