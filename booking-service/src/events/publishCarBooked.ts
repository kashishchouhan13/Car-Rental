import { connectRabbitMQ } from "../rabbitmq/connect";

export const publishCarBooked = async (bookingData: any) => {
  const connection = await connectRabbitMQ();
  const channel = await connection.createChannel();
  await channel.assertExchange("payments_exchange", "topic", { durable: true });
  channel.publish("payments_exchange", "payment.initiate", Buffer.from(JSON.stringify(bookingData)));
  await channel.close();
  await connection.close();
};


