import amqp from "amqplib";
import { connectRabbitMQ } from "../rabbitmq/connect";

export const publishCarReturned = async (carId: string) => {
  const connection = await connectRabbitMQ();
  const channel = await connection.createChannel();

  const queue = "car_returned";
  await channel.assertQueue(queue, { durable: true });

  const message = JSON.stringify({ carId });
  channel.sendToQueue(queue, Buffer.from(message));

  await channel.close();
  await connection.close();
};
