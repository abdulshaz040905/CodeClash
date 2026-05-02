import express from "express";
import cors from "cors";
import problemRoutes from "./routes/problemRoutes";
import runRoutes from "./routes/runRoutes";


import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/codearena")
  .then(() => console.log("DB connected"))
  .catch((err) => console.log(err));

const app = express();

app.use(cors());
app.use(express.json());


app.use("/api/problems", problemRoutes);
app.use("/api/run", runRoutes);

app.get("/", (req, res) => {
  res.send("API running...");
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});