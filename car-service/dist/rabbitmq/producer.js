"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishEvent = void 0;
const amqplib_1 = __importDefault(require("amqplib"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const publishEvent = async (exchange, routingKey, message) => {
    const connection = await amqplib_1.default.connect(process.env.RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertExchange(exchange, "topic", { durable: true });
    channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)));
    await channel.close();
    await connection.close();
};
exports.publishEvent = publishEvent;
