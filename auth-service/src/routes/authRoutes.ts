import express from "express";
import { register ,login, getAllUsers, updateUserRole, verifyToken, logoutUser, getUserById } from "../controllers/authController";
import { requireAdmin } from "../middleware/requireAdmin";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/users", requireAdmin, getAllUsers);
router.get("/user/:id",getUserById);
router.put("/update-role/:id", requireAdmin, updateUserRole);
router.get("/verify-token", verifyToken);
router.post("/logout",logoutUser);
export default router;
