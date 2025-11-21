"use strict";
// import express from "express";
// import dotenv from "dotenv";
// import bookingRoutes from "./routes/bookingRoutes";
// import { startCarConsumer } from "./events/CarCreatedConsumer";
// import { startBookingConsumer } from "./events/paymentSuccessConsumer";
// import { redisClient } from "./redis/client";
// import mongoose from "mongoose";
// import "./returnCarWorker";
// import cors from "cors";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// dotenv.config();
// const app = express();
// app.use(cors({
//   origin: "http://localhost:5173",
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   allowedHeaders: ["Content-Type", "Authorization"]
// }));
// app.use(express.json());
// app.use("/api/bookings", bookingRoutes);
// mongoose.connect(process.env.MONGO_URI!)
//   .then(() => console.log(" MongoDB connected"))
//   .catch(err => console.error("MongoDB connection error:", err));
// (async () => {
//   await redisClient.connect().catch(() => {});
// startCarConsumer().catch(err =>
//   console.log("❌ Car consumer failed:", err.message)
// );
// startBookingConsumer().catch(err =>
//   console.log("❌ Booking consumer failed:", err.message)
// );
//   const PORT = Number(process.env.PORT || 5003);
//   app.listen(PORT, () => console.log(`Booking Service running on port ${PORT}`)
// );
// })();
// src/index.ts (or src/app.ts / src/server.ts - whichever you call)
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const bookingRoutes_1 = __importDefault(require("./routes/bookingRoutes"));
const CarCreatedConsumer_1 = require("./events/CarCreatedConsumer");
const paymentSuccessConsumer_1 = require("./events/paymentSuccessConsumer");
const client_1 = require("./redis/client");
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express_1.default.json());
app.use("/api/bookings", bookingRoutes_1.default);
mongoose_1.default.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));
(async () => {
    try {
        await client_1.redisClient.connect().catch(() => { });
    }
    catch (err) {
        console.warn("Redis connect failed:", err);
    }
    // start consumers — they handle RabbitMQ reconnect internally via connectRabbitMQ
    (0, CarCreatedConsumer_1.startCarConsumer)().catch(err => console.error("❌ startCarConsumer failed:", err));
    (0, paymentSuccessConsumer_1.startBookingConsumer)().catch(err => console.error("❌ startBookingConsumer failed:", err));
    const PORT = Number(process.env.PORT || 5003);
    app.listen(PORT, () => console.log(`Booking Service running on port ${PORT}`));
})();
