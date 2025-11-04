"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClient = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.redisClient = new ioredis_1.default({
    host: process.env.REDIS_HOST || "redis",
    port: Number(process.env.REDIS_PORT) || 6379
});
exports.redisClient.on("connect", () => console.log(" Redis connected"));
exports.redisClient.on("error", (err) => console.error("Redis error:", err));
