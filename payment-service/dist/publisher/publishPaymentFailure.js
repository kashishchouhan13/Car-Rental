"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishPaymentFailed = void 0;
const amqplib_1 = __importDefault(require("amqplib"));
const publishPaymentFailed = async (data) => {
    const connection = await amqplib_1.default.connect(process.env.RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertExchange("payments_exchange", "topic", { durable: true });
    channel.publish("payments_exchange", "payment.failed", Buffer.from(JSON.stringify(data)));
    console.log("📤 Published payment FAILED event", data);
};
exports.publishPaymentFailed = publishPaymentFailed;
