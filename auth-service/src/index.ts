// import express from "express";
// import dotenv from "dotenv";
// import { connectDB } from "./config/db";
// import authRoutes from "./routes/authRoutes";

// dotenv.config();
// const app = express();
// app.use(express.json());

// (async () => {
//   await connectDB(process.env.MONGO_URI!);
//   app.use("/api/auth", authRoutes);

//   const PORT = Number(process.env.PORT || 5001);
//   app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// })();
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db";
import authRoutes from "./routes/authRoutes";

dotenv.config();
const app = express();

// Docker-friendly CORS config
app.use(
  cors({
    origin: ["http://localhost:5173"],   // frontend
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

(async () => {
  await connectDB(process.env.MONGO_URI!);

  app.use("/api/auth", authRoutes);

  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => console.log(`Auth Service running on port ${PORT}`));
})();
