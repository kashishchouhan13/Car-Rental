import amqp from "amqplib";

export async function connectRabbitMQ() {
  while (true) {
    try {
      console.log("⏳ Trying to connect to RabbitMQ...");
      const connection = await amqp.connect(process.env.RABBITMQ_URL!);
      console.log("🐇 Connected to RabbitMQ");
      return connection;
    } catch (err) {
      console.error("❌ RabbitMQ connection failed, retrying in 5 seconds...");
      await new Promise(res => setTimeout(res, 5000));
    }
  }
}
