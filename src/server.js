import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "../database/db.js";
import userRoutes from "./routes/user.route.js";
import tasRoutes from "./routes/task.route.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// middleware
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

// All Routes
app.use("/api/user", userRoutes);
app.use("/api/tasks", tasRoutes);
// Routes
app.get("/", (req, res) => {
  res.send("Taskflow backend Server ");
});

connectDB();

app.listen(PORT, () => {
  console.log(`Server running the port ${PORT}`);
});

export default app;