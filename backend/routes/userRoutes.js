import express from "express";
import {
  deleteUser,
  getMe,
  login,
  logout,
  register,
} from "../controllers/userControllers.js";
const router = express.Router();
import { protect } from "../middleware/middleware.js";

router.post("/auth/register", register);
router.post("/auth/login", login);
router.post("/auth/logout", logout);
router.get("/users/me", protect, getMe);
router.delete("/users/:id", deleteUser);

export default router;
