"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const cors_1 = __importDefault(require("cors"));
const PaymentRoutes_1 = __importDefault(require("./routes/PaymentRoutes"));
const webhook_1 = __importDefault(require("./webhook"));
const app = (0, express_1.default)();
// important: webhook must use raw body
app.use("/stripe/webhook", express_1.default.raw({ type: "application/json" }), webhook_1.default);
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use("/api/pay", PaymentRoutes_1.default);
app.listen(5004, () => console.log("Payment Service running on 5004"));
