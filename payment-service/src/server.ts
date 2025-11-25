import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import paymentRoutes from "./routes/PaymentRoutes";
import webhookRoute from "./webhook";


const app = express();

// important: webhook must use raw body
app.use(
  "/stripe/webhook",
  express.raw({ type: "application/json" }),
  webhookRoute
);

// Normal JSON parser for other routes
app.use(express.json());
app.use(cors());

// REST API
app.use("/api/pay", paymentRoutes);

app.listen(5004, () => console.log("Payment Service running on 5004"));
