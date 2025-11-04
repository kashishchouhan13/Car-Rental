import amqp from "amqplib";
import { Booking } from "../models/Booking";
import { returnCarQueue } from "../returnCarQueue";

export const startBookingConsumer = async () => {
  const connection = await amqp.connect("amqp://rabbitmq:5672");
  const channel = await connection.createChannel();

  await channel.assertExchange("payments_exchange", "topic", { durable: true });
  const q = await channel.assertQueue("booking_payment_queue");
  await channel.bindQueue(q.queue, "payments_exchange", "payment.*");

  channel.consume(q.queue, async (msg) => {
    if (!msg) return;
    const event = JSON.parse(msg.content.toString());
    if (msg.fields.routingKey === "payment.success") {

      const booking=await Booking.findByIdAndUpdate(event.bookingId, {
        status: "CONFIRMED",
        paymentId: event.paymentId
      });
      if (booking) {
          const delay = new Date(booking.endDate).getTime() - Date.now();
          if (delay > 0) {
            await returnCarQueue.add(
              "return-car-job",
              { carId: booking.carId },
              { delay }
            );
          } else {
            console.log(" endDate is already past");
          }
        }
    }
    if (msg.fields.routingKey === "payment.failed") {
      await Booking.findByIdAndUpdate(event.bookingId, { status: "FAILED" });
    }

    channel.ack(msg);
  });
};
