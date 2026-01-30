import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  updateTask,
} from "../controllers/task.controller.js";

const router = express.Router();

router
  .route("/")
  .get(authMiddleware, getTasks)
  .post(authMiddleware, createTask); 

router
  .route("/:id")
  .get(authMiddleware, getTaskById)
  .put(authMiddleware, updateTask)
  .delete(authMiddleware, deleteTask);

export default router;
