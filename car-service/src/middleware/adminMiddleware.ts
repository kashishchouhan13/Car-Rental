import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { redisClient } from "../redis";

export const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "No token provided" });

    const token = authHeader.split(" ")[1];

    const decoded =jwt.verify(token, process.env.JWT_SECRET || "secret")as { id: string };

    // Get role from Redis
    const userDataStr = await redisClient.get(`user:${decoded.id}`);
    if (!userDataStr) return res.status(401).json({ message: "Invalid token" });

    const userData = JSON.parse(userDataStr);
    if (userData.role !== "admin") return res.status(403).json({ message: "Admin only route" });
    req.user = userData; // attach user info
    next();
  } catch (err) {
    res.status(401).json({ message: "Unauthorized", error: (err as Error).message });
  }
};
