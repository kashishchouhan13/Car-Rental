"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startConsumers = void 0;
const amqplib_1 = __importDefault(require("amqplib"));
const redis_1 = require("../redis");
const car_1 = require("../models/car");
const connectRabbitMQ = async () => {
    let connection;
    while (!connection) {
        try {
            connection = await amqplib_1.default.connect(process.env.RABBITMQ_URL);
            console.log(" RabbitMQ connected");
        }
        catch (err) {
            await new Promise(res => setTimeout(res, 3000));
        }
    }
    return connection;
};
const startConsumers = async () => {
    const connection = await connectRabbitMQ();
    const channel = await connection.createChannel();
    const exchange = "payments_exchange";
    await channel.assertExchange(exchange, "topic", { durable: true });
    const queue = "car_payment_queue";
    await channel.assertQueue(queue, { durable: true });
    await channel.bindQueue(queue, exchange, "payment.success");
    const returnedQueue = "car_returned";
    await channel.assertQueue(returnedQueue, { durable: true });
    // Car Booked Consumer
    channel.consume(queue, async (msg) => {
        if (!msg)
            return;
        const { carId } = JSON.parse(msg.content.toString());
        const exists = await redis_1.redisClient.hget("availableCars", carId);
        if (exists)
            await redis_1.redisClient.hdel("availableCars", carId);
        const car = await car_1.Car.findById(carId);
        if (car) {
            car.available = false;
            await car.save();
        }
        channel.ack(msg);
    });
    // Car Returned Consumer
    channel.consume(returnedQueue, async (msg) => {
        if (!msg)
            return;
        const { carId } = JSON.parse(msg.content.toString());
        const car = await car_1.Car.findById(carId);
        if (car) {
            car.available = true;
            await car.save();
            await redis_1.redisClient.hset("availableCars", carId, JSON.stringify(car));
        }
        channel.ack(msg);
    });
};
exports.startConsumers = startConsumers;
