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
    origin: [
      "https://taskflow-frontend-kohl.vercel.app",
      "http://localhost:5173",
    ],
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

// app.listen(PORT, () => {
//   console.log(`Server running the port ${PORT}`);
// });

export default app;
/* 
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "../database/db.js";
import userRoutes from "./routes/user.route.js";
import tasRoutes from "./routes/task.route.js";

dotenv.config();

const app = express();

// =====================
// DATABASE CONNECTION
// =====================
connectDB();

// =====================
// MIDDLEWARE
// =====================
app.use(express.json());

// Multiple frontend support (Professional way)
const allowedOrigins = process.env.FRONTEND_URLS
  ? process.env.FRONTEND_URLS.split(",")
  : [];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// =====================
// ROUTES
// =====================
app.use("/api/user", userRoutes);
app.use("/api/tasks", tasRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Taskflow backend server running 🚀",
  });
});

// =====================
// EXPORT (Important for Vercel)
// =====================
export default app;
 */
