import amqp from "amqplib";

export const publishCarBooked = async (bookingData: any) => {
  const connection = await amqp.connect(process.env.RABBITMQ_URL!);
  const channel = await connection.createChannel();

  const exchange = "payments_exchange";
  await channel.assertExchange(exchange, "topic", { durable: true });

  channel.publish(exchange, "payment.initiate", Buffer.from(JSON.stringify(bookingData)));

  await channel.close();
  await connection.close();
};


