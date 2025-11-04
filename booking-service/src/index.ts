import express from "express";
import dotenv from "dotenv";
import bookingRoutes from "./routes/bookingRoutes";
import { startCarConsumer } from "./events/CarCreatedConsumer";
import { startBookingConsumer } from "./events/paymentSuccessConsumer";
import { redisClient } from "./redis/client";
import mongoose from "mongoose";
import "./returnCarWorker";

dotenv.config();
const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI!)
  .then(() => console.log(" MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));


(async () => {
  await redisClient.connect().catch(() => {});
  await startCarConsumer();
  await startBookingConsumer();
  app.use("/api/bookings", bookingRoutes);

  const PORT = Number(process.env.PORT || 5003);
  app.listen(PORT, () => console.log(`Booking Service running on port ${PORT}`)

);
})();

