"use strict";
// import amqp from "amqplib";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishCarBooked = void 0;
// export const publishCarBooked = async (bookingData: any) => {
//   const connection = await amqp.connect(process.env.RABBITMQ_URL!);
//   const channel = await connection.createChannel();
//   const exchange = "payments_exchange";
//   await channel.assertExchange(exchange, "topic", { durable: true });
//   channel.publish(exchange, "payment.initiate", Buffer.from(JSON.stringify(bookingData)));
//   await channel.close();
//   await connection.close();
// };
// src/events/publishCarBooked.ts
const connect_1 = require("../rabbitmq/connect");
const publishCarBooked = async (bookingData) => {
    const connection = await (0, connect_1.connectRabbitMQ)();
    const channel = await connection.createChannel();
    await channel.assertExchange("payments_exchange", "topic", { durable: true });
    channel.publish("payments_exchange", "payment.initiate", Buffer.from(JSON.stringify(bookingData)));
    await channel.close();
    await connection.close();
};
exports.publishCarBooked = publishCarBooked;
