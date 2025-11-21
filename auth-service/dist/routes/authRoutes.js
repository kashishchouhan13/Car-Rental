"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const requireAdmin_1 = require("../middleware/requireAdmin");
const router = express_1.default.Router();
router.post("/register", authController_1.register);
router.post("/login", authController_1.login);
router.get("/users", requireAdmin_1.requireAdmin, authController_1.getAllUsers);
router.put("/update-role/:id", requireAdmin_1.requireAdmin, authController_1.updateUserRole);
exports.default = router;
