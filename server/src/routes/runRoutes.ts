import express from "express";
import { exec } from "child_process";

const router = express.Router();

router.post("/", (req, res) => {
  const { code } = req.body;

  exec(`python3 -c "${code}"`, (error, stdout, stderr) => {
    if (error) {
      return res.json({ error: stderr });
    }
    res.json({ output: stdout });
  });
});

export default router;