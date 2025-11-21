"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishCarReturned = void 0;
const connect_1 = require("../rabbitmq/connect");
const publishCarReturned = async (carId) => {
    const connection = await (0, connect_1.connectRabbitMQ)();
    const channel = await connection.createChannel();
    const queue = "car_returned";
    await channel.assertQueue(queue, { durable: true });
    const message = JSON.stringify({ carId });
    channel.sendToQueue(queue, Buffer.from(message));
    await channel.close();
    await connection.close();
};
exports.publishCarReturned = publishCarReturned;
