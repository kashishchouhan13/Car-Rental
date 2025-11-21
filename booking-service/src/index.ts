import express from "express";
import dotenv from "dotenv";
import bookingRoutes from "./routes/bookingRoutes";
import { startCarConsumer } from "./events/CarCreatedConsumer";
import { startBookingConsumer } from "./events/paymentSuccessConsumer";
import { redisClient } from "./redis/client";
import mongoose from "mongoose";
import cors from "cors";

dotenv.config();
const app = express();
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET","POST","PUT","DELETE"],
  allowedHeaders: ["Content-Type","Authorization"]
}));
app.use(express.json());
app.use("/api/bookings", bookingRoutes);

mongoose.connect(process.env.MONGO_URI!)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

(async () => {
  try {
    await redisClient.connect().catch(() => {});
  } catch(err) {
    console.warn("Redis connect failed:", err);
  }

  // start consumers — they handle RabbitMQ reconnect internally via connectRabbitMQ
  startCarConsumer().catch(err => console.error("❌ startCarConsumer failed:", err));
  startBookingConsumer().catch(err => console.error("❌ startBookingConsumer failed:", err));

  const PORT = Number(process.env.PORT || 5003);
  app.listen(PORT, () => console.log(`Booking Service running on port ${PORT}`));
})();
