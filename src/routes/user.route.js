import express from "express";
import {
  getCurrentUser,
  loginUser,
  registerUser,
  updatePassword,
  updateProfile,
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/me", authMiddleware, getCurrentUser);
router.put("/profile", authMiddleware, updateProfile);
router.put("/password", authMiddleware, updatePassword);

export default router;
