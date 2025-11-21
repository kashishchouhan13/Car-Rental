import { connectRabbitMQ } from "../rabbitmq/connect";
import { Booking } from "../models/Booking";

export const startBookingConsumer = async () => {
  const connection = await connectRabbitMQ();
  const channel = await connection.createChannel();

  await channel.assertExchange("payments_exchange", "topic", { durable: true });
  const q = await channel.assertQueue("booking_payment_queue", { durable: true });
  await channel.bindQueue(q.queue, "payments_exchange", "payment.*");

  channel.consume(q.queue, async (msg) => {
    if (!msg) return;
    try {
      const event = JSON.parse(msg.content.toString());
      const routingKey = msg.fields.routingKey;
      if (routingKey === "payment.success") {
        await Booking.findByIdAndUpdate(event.bookingId, {
          status: "confirmed",
          paymentId: event.paymentId,
        });

        // schedule return job logic here...
      } else if (routingKey === "payment.failed") {
        await Booking.findByIdAndUpdate(event.bookingId, { status: "failed" });
      }
    } catch (err: any) {
      console.error("❌ booking consumer error:", err.message || err);
    } finally {
      channel.ack(msg);
    }
  });

  console.log("✅ Booking consumer started");
};
