import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { redisClient } from "../config/redis";

export const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as { id: string };

    // read user data from redis
    const data = await redisClient.get(`user:${decoded.id}`);
    if (!data) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const userData = JSON.parse(data);

    if (userData.role !== "admin") {
      return res.status(403).json({ message: "Admin access only" });
    }

    (req as any).user = userData; // attach user
    next();

  } catch (err: any) {
    return res.status(401).json({ message: err.message });
  }
};
