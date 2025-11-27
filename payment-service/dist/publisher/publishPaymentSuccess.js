"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishPaymentSuccess = void 0;
const amqplib_1 = __importDefault(require("amqplib"));
const publishPaymentSuccess = async (bookingData) => {
    const connection = await amqplib_1.default.connect(process.env.RABBITMQ_URL);
    const channel = await connection.createChannel();
    const exchange = "payments_exchange";
    await channel.assertExchange(exchange, "topic", { durable: true });
    channel.publish(exchange, "payment.success", Buffer.from(JSON.stringify(bookingData)));
    console.log("📤 Published payment sccess event", bookingData);
    await channel.close();
    await connection.close();
};
exports.publishPaymentSuccess = publishPaymentSuccess;
