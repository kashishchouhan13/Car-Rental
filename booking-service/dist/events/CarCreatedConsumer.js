"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startCarConsumer = void 0;
// src/events/CarCreatedConsumer.ts
const connect_1 = require("../rabbitmq/connect");
const client_1 = require("../redis/client");
const startCarConsumer = async () => {
    const connection = await (0, connect_1.connectRabbitMQ)();
    const channel = await connection.createChannel();
    await channel.assertExchange("car_exchange", "topic", { durable: true });
    const q = await channel.assertQueue("", { exclusive: true });
    await channel.bindQueue(q.queue, "car_exchange", "car.created");
    channel.consume(q.queue, async (msg) => {
        if (!msg)
            return;
        try {
            const car = JSON.parse(msg.content.toString());
            await client_1.redisClient.hset("availableCars", car.id, JSON.stringify(car));
        }
        catch (err) {
            console.error("❌ car consumer message handling error:", err.message || err);
        }
        finally {
            channel.ack(msg);
        }
    });
    console.log("✅ Car consumer started");
};
exports.startCarConsumer = startCarConsumer;
