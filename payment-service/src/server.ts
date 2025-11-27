import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import paymentRoutes from "./routes/PaymentRoutes";
import webhookRoute from "./webhook";


const app = express();

// important: webhook must use raw body
app.use(
  "/api/pay/webhook",
  express.raw({ type: "application/json" }),
  webhookRoute
);

app.use(express.json());
app.use(cors());
app.use("/api/pay", paymentRoutes);

app.listen(5004, () => console.log("Payment Service running on 5004"));
