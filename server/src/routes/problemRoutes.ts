import express from "express";
import Problem from "../models/Problem";

const router = express.Router();

router.post("/add", async (req, res) => {
  const problem = new Problem(req.body);
  await problem.save();
  res.json(problem);
});

router.get("/", async (req, res) => {
  const problems = await Problem.find();
  res.json(problems);
});

export default router;