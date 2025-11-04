import amqplib from "amqplib";
import dotenv from "dotenv";

dotenv.config();

export const publishEvent = async (exchange: string, routingKey: string, message: any) => {
  const connection = await amqplib.connect(process.env.RABBITMQ_URL!);
  const channel = await connection.createChannel();

  await channel.assertExchange(exchange, "topic", { durable: true });
  channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)));

  await channel.close();
  await connection.close();
};
