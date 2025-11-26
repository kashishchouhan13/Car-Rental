import amqp from "amqplib";

export const publishPaymentFailed = async (data: any) => {
   const connection = await amqp.connect(process.env.RABBITMQ_URL!);
   const channel = await connection.createChannel();

  await channel.assertExchange("payments_exchange", "topic", { durable: true });

  channel.publish(
    "payments_exchange",
    "payment.failed",
    Buffer.from(JSON.stringify(data))
  );

  console.log("📤 Published payment FAILED event", data);
};
