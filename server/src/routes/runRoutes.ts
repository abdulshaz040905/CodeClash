import express from "express";
import { exec } from "child_process";
import fs from "fs";
import Problem from "../models/Problem";

const router = express.Router();

router.post("/submit", async (req, res) => {
  try {
    const { code, problemId } = req.body;

    const problem = await Problem.findById(problemId);

    if (!problem) {
      return res.status(404).json({ error: "Problem not found" });
    }

    const results = [];

    for (const testCase of problem.testCases) {
      // Create dynamic Python script
      const script = `
input_data = """${testCase.input}"""

def input():
    return input_data

code = """${code}"""

try:
    exec(code)
except Exception as e:
    print(e)
`;

      // Write temp file
      fs.writeFileSync("temp.py", script);

      // Run in Docker
      const output: string = await new Promise((resolve) => {
        exec(
          `docker run --rm -v ${process.cwd()}:/app code-runner python3 /app/temp.py`,
          (error, stdout, stderr) => {
            if (error) return resolve(stderr);
            resolve(stdout);
          }
        );
      });

      const passed = output.trim() === testCase.output.trim();

      results.push({
        input: testCase.input,
        expected: testCase.output,
        output,
        passed,
      });
    }

    const success = results.every((r) => r.passed);

    res.json({
      success,
      results,
    });
  } catch (err) {
    res.status(500).json({ error: "Execution failed" });
  }
});

export default router;