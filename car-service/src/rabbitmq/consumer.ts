import amqp from "amqplib";
import { redisClient } from "../redis";
import { Car } from "../models/car";

const connectRabbitMQ = async () => {
  let connection;
  while (!connection) {
    try {
      connection = await amqp.connect(process.env.RABBITMQ_URL!);
      console.log(" RabbitMQ connected");
    } catch (err) {
      await new Promise(res => setTimeout(res, 3000));
    }
  }
  return connection;
};

export const startConsumers = async () => {
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
    if (!msg) return;
    const { carId } = JSON.parse(msg.content.toString());

    const exists = await redisClient.hget("availableCars", carId);
    if (exists) await redisClient.hdel("availableCars", carId);

    const car = await Car.findById(carId);
    if (car) {
      car.available = false;
      await car.save();
    }

    channel.ack(msg);
  });

  // Car Returned Consumer
  channel.consume(returnedQueue, async (msg) => {
    if (!msg) return;
    const { carId } = JSON.parse(msg.content.toString());

    const car = await Car.findById(carId);
    if (car) {
      car.available = true;
      await car.save();

      await redisClient.hset("availableCars", carId, JSON.stringify(car));
    }

    channel.ack(msg);
  });
};

