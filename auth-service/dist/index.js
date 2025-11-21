"use strict";
// import express from "express";
// import dotenv from "dotenv";
// import { connectDB } from "./config/db";
// import authRoutes from "./routes/authRoutes";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// dotenv.config();
// const app = express();
// app.use(express.json());
// (async () => {
//   await connectDB(process.env.MONGO_URI!);
//   app.use("/api/auth", authRoutes);
//   const PORT = Number(process.env.PORT || 5001);
//   app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// })();
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./config/db");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Docker-friendly CORS config
app.use((0, cors_1.default)({
    origin: ["http://localhost:5173"], // frontend
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));
// Needed for OPTIONS preflight in Docker
app.use((0, cors_1.default)());
app.use(express_1.default.json());
(async () => {
    await (0, db_1.connectDB)(process.env.MONGO_URI);
    app.use("/api/auth", authRoutes_1.default);
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => console.log(`Auth Service running on port ${PORT}`));
})();
