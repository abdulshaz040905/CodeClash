import Editor from "@monaco-editor/react";
import { useState } from "react";
import API from "../services/api";

const CodeEditor = () => {
  const [code, setCode] = useState<string>("print('Hello')");
  const [output, setOutput] = useState<string>("");

  const runCode = async () => {
    try {
      const res = await API.post("/run", { code });
      setOutput(res.data.output || res.data.error);
    } catch (err) {
      setOutput("Error running code");
    }
  };

  return (
    <div>
      <div style={{ height: "400px" }}>
        <Editor
          height="100%"
          defaultLanguage="python"
          theme="vs-dark"
          value={code}
          onChange={(value) => setCode(value || "")}
        />
      </div>

      <button onClick={runCode}>Run Code</button>

      <div>
        <h3>Output:</h3>
        <pre>{output}</pre>
      </div>
    </div>
  );
};

export default CodeEditor;