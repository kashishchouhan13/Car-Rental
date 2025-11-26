import amqp from "amqplib";

export const publishPaymentSuccess = async (bookingData: any) => {
  const connection = await amqp.connect(process.env.RABBITMQ_URL!);
  const channel = await connection.createChannel();

  const exchange = "payments_exchange";
  await channel.assertExchange(exchange, "topic", { durable: true });

  channel.publish(exchange, "payment.success", Buffer.from(JSON.stringify(bookingData)));
  
  console.log("📤 Published payment sccess event", bookingData);

  await channel.close();
  await connection.close();
};
