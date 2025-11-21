"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./db");
const commandRoutes_1 = __importDefault(require("./routes/commandRoutes"));
const queryRoutes_1 = __importDefault(require("./routes/queryRoutes"));
const consumer_1 = require("./rabbitmq/consumer");
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api/car/command", commandRoutes_1.default);
app.use("/api/car/query", queryRoutes_1.default);
const PORT = process.env.PORT || 5002;
(0, db_1.connectDB)().then(async () => {
    console.log(" MongoDB connected");
    await (0, consumer_1.startConsumers)();
    app.listen(PORT, () => {
        console.log(`Car Service running on port ${PORT}`);
    });
});
