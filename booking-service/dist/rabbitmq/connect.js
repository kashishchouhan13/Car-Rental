"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectRabbitMQ = connectRabbitMQ;
const amqplib_1 = __importDefault(require("amqplib"));
async function connectRabbitMQ() {
    while (true) {
        try {
            console.log("⏳ Trying to connect to RabbitMQ...");
            const connection = await amqplib_1.default.connect(process.env.RABBITMQ_URL);
            console.log("🐇 Connected to RabbitMQ");
            return connection;
        }
        catch (err) {
            console.error("❌ RabbitMQ connection failed, retrying in 5 seconds...");
            await new Promise(res => setTimeout(res, 5000));
        }
    }
}
