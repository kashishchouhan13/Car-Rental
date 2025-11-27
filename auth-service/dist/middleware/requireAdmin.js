"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const redis_1 = require("../config/redis");
const requireAdmin = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: "No token provided" });
        }
        const token = authHeader.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "secret");
        // read user data from redis
        const data = await redis_1.redisClient.get(`user:${decoded.id}`);
        if (!data) {
            return res.status(401).json({ message: "Invalid token" });
        }
        const userData = JSON.parse(data);
        if (userData.role !== "admin") {
            return res.status(403).json({ message: "Admin access only" });
        }
        req.user = userData;
        next();
    }
    catch (err) {
        return res.status(401).json({ message: err.message });
    }
};
exports.requireAdmin = requireAdmin;
