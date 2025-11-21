"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const redis_1 = require("../redis");
const requireAdmin = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader)
            return res.status(401).json({ message: "No token provided" });
        const token = authHeader.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "secret");
        // Get role from Redis
        const userDataStr = await redis_1.redisClient.get(`user:${decoded.id}`);
        if (!userDataStr)
            return res.status(401).json({ message: "Invalid token" });
        const userData = JSON.parse(userDataStr);
        if (userData.role !== "admin")
            return res.status(403).json({ message: "Admin only route" });
        req.user = userData; // attach user info
        next();
    }
    catch (err) {
        res.status(401).json({ message: "Unauthorized", error: err.message });
    }
};
exports.requireAdmin = requireAdmin;
