import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db";
import commandRoutes from "./routes/commandRoutes";
import queryRoutes from "./routes/queryRoutes";
import { startConsumers } from "./rabbitmq/consumer";

dotenv.config();
const app = express();
app.use(express.json());

app.use("/api/car/command", commandRoutes);
app.use("/api/car/query", queryRoutes);


const PORT = process.env.PORT || 5002;
connectDB().then(async () => {
  console.log(" MongoDB connected");

await startConsumers();

  app.listen(PORT, () => {
    console.log(`Car Service running on port ${PORT}`);
  });
});

