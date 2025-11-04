import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

export const redisClient = new Redis({
  host: process.env.REDIS_HOST || "redis",
  port: Number(process.env.REDIS_PORT) || 6379
});

redisClient.on("connect", () => console.log(" Redis connected"));
redisClient.on("error", (err) => console.error("Redis error:", err));

