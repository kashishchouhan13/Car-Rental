"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./config/db");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
(async () => {
    await (0, db_1.connectDB)(process.env.MONGO_URI);
    app.use("/api/auth", authRoutes_1.default);
    const PORT = Number(process.env.PORT || 5001);
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})();
