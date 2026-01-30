import express from "express";
import dotenv from "dotenv";
import connectDB from "../database/db.js";
import userRoutes from "./routes/user.route.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// middleware
app.use(express.json());

// All Routes
app.use("/api/user", userRoutes);

// Routes
app.get("/", (req, res) => {
  res.send("Taskflow backend Server ");
});

connectDB();

app.listen(PORT, () => {
  console.log(`Server running the port ${PORT}`);
});
