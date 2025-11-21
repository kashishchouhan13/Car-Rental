import { connectRabbitMQ } from "../rabbitmq/connect";
import { redisClient } from "../redis/client";

export const startCarConsumer = async () => {
  const connection = await connectRabbitMQ();
  const channel = await connection.createChannel();

  await channel.assertExchange("car_exchange", "topic", { durable: true });
  const q = await channel.assertQueue("", { exclusive: true });
  await channel.bindQueue(q.queue, "car_exchange", "car.created");

  channel.consume(q.queue, async (msg) => {
    if (!msg) return;
    try {
      const car = JSON.parse(msg.content.toString());
      await redisClient.hset("availableCars", car.id, JSON.stringify(car));
    } catch (err: any) {
      console.error("❌ car consumer message handling error:", err.message || err);
    } finally {
      channel.ack(msg);
    }
  });

  console.log("✅ Car consumer started");
};
