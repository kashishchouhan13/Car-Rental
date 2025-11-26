"use strict";
// import { connectRabbitMQ } from "../rabbitmq/connect";
// import { redisClient } from "../redis/client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startCarConsumer = void 0;
// export const startCarConsumer = async () => {
//   const connection = await connectRabbitMQ();
//   const channel = await connection.createChannel();
//   await channel.assertExchange("car_exchange", "topic", { durable: true });
//   const q = await channel.assertQueue("", { exclusive: true });
//   await channel.bindQueue(q.queue, "car_exchange", "car.created");
//   channel.consume(q.queue, async (msg) => {
//     if (!msg) return;
//     try {
//       const car = JSON.parse(msg.content.toString());
//       await redisClient.hset("availableCars", car.id, JSON.stringify(car));
//     } catch (err: any) {
//       console.error("❌ car consumer message handling error:", err.message || err);
//     } finally {
//       channel.ack(msg);
//     }
//   });
//   console.log("✅ Car consumer started");
// };
// import { connectRabbitMQ } from "../rabbitmq/connect";
// import { redisClient } from "../redis/client";
// export const startCarConsumer = async () => {
//   const connection = await connectRabbitMQ();
//   const channel = await connection.createChannel();
//   await channel.assertExchange("car_exchange", "topic", { durable: true });
//   const q = await channel.assertQueue("", { exclusive: true });
//   // Listen to both events
//   await channel.bindQueue(q.queue, "car_exchange", "car.created");
//   await channel.bindQueue(q.queue, "car_exchange", "car.updated");
//   channel.consume(q.queue, async (msg) => {
//     if (!msg) return;
//     try {
//       const event = JSON.parse(msg.content.toString());
//       const routingKey = msg.fields.routingKey;
//       // 💚 CAR CREATED
//       if (routingKey === "car.created") {
//         console.log("📥 Redis: Adding new car:", event.id);
//         await redisClient.hset("availableCars", event.id, JSON.stringify(event));
//       }
//       // 🔧 CAR UPDATED
//       if (routingKey === "car.updated") {
//         console.log("♻ Redis: Updating existing car:", event.id);
//         await redisClient.hset("availableCars", event._id, JSON.stringify(event));
//       }
//     }
//     catch (err: any) {
//       console.error("❌ car consumer error:", err.message);
//     }
//     finally {
//       channel.ack(msg);
//     }
//   });
//   console.log("✅ Car consumer started and listening for created + updated");
// };
const connect_1 = require("../rabbitmq/connect");
const client_1 = require("../redis/client");
const startCarConsumer = async () => {
    const connection = await (0, connect_1.connectRabbitMQ)();
    const channel = await connection.createChannel();
    await channel.assertExchange("car_exchange", "topic", { durable: true });
    const q = await channel.assertQueue("", { exclusive: true });
    await channel.bindQueue(q.queue, "car_exchange", "car.created");
    await channel.bindQueue(q.queue, "car_exchange", "car.updated");
    channel.consume(q.queue, async (msg) => {
        if (!msg)
            return;
        try {
            const event = JSON.parse(msg.content.toString());
            const routingKey = msg.fields.routingKey;
            const carId = event._id; // 🔥 ALWAYS USE _id
            if (!carId) {
                console.error("❌ Missing _id in event:", event);
                return;
            }
            if (routingKey === "car.created") {
                console.log("📥 Redis: Adding new car:", carId);
                await client_1.redisClient.hset("availableCars", carId, JSON.stringify(event));
            }
            if (routingKey === "car.updated") {
                console.log("♻ Redis: Updating car:", carId);
                await client_1.redisClient.hset("availableCars", carId, JSON.stringify(event));
            }
        }
        catch (err) {
            console.error("❌ car consumer error:", err.message);
        }
        finally {
            channel.ack(msg);
        }
    });
    console.log("✅ Car consumer fixed and listening");
};
exports.startCarConsumer = startCarConsumer;
