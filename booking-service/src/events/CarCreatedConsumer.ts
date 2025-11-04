import amqp from "amqplib";
import { redisClient } from "../redis/client";

export const startCarConsumer = async () => {
  const connection = await amqp.connect(process.env.RABBITMQ_URL!);
  const channel = await connection.createChannel();
  await channel.assertExchange("car_exchange", "topic", { durable: true });

  const q = await channel.assertQueue("", { exclusive: true });
  await channel.bindQueue(q.queue, "car_exchange", "car.created");

  channel.consume(q.queue, async (msg) => {
    if (msg) {
      const car = JSON.parse(msg.content.toString());
      await redisClient.hset("availableCars", car.id, JSON.stringify(car));
      channel.ack(msg);
    }
  });
};
