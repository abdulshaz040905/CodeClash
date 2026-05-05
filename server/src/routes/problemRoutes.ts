import express from "express";
import Problem from "../models/Problem";

const router = express.Router();

// Add problem
router.post("/add", async (req, res) => {
  try {
    const problem = new Problem(req.body);
    await problem.save();
    res.json(problem);
  } catch (err) {
    res.status(500).json({ error: "Failed to add problem" });
  }
});

// Get all problems
router.get("/", async (req, res) => {
  const problems = await Problem.find();
  res.json(problems);
});

export default router;