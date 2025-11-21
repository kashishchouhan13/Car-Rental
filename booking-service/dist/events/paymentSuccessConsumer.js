"use strict";
// import amqp from "amqplib";
// import { Booking } from "../models/Booking";
// import { returnCarQueue } from "../returnCarQueue";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startBookingConsumer = void 0;
// export const startBookingConsumer = async () => {
//   const connection = await amqp.connect("amqp://rabbitmq:5672");
//   const channel = await connection.createChannel();
//   await channel.assertExchange("payments_exchange", "topic", { durable: true });
//   const q = await channel.assertQueue("booking_payment_queue");
//   await channel.bindQueue(q.queue, "payments_exchange", "payment.*");
//   channel.consume(q.queue, async (msg) => {
//     if (!msg) return;
//     const event = JSON.parse(msg.content.toString());
//     if (msg.fields.routingKey === "payment.success") {
//       const booking=await Booking.findByIdAndUpdate(event.bookingId, {
//         status: "CONFIRMED",
//         paymentId: event.paymentId
//       });
//       if (booking) {
//           const delay = new Date(booking.endDate).getTime() - Date.now();
//           if (delay > 0) {
//             await returnCarQueue.add(
//               "return-car-job",
//               { carId: booking.carId },
//               { delay }
//             );
//           } else {
//             console.log(" endDate is already past");
//           }
//         }
//     }
//     if (msg.fields.routingKey === "payment.failed") {
//       await Booking.findByIdAndUpdate(event.bookingId, { status: "FAILED" });
//     }
//     channel.ack(msg);
//   });
// };
// src/events/paymentSuccessConsumer.ts
const connect_1 = require("../rabbitmq/connect");
const Booking_1 = require("../models/Booking");
const startBookingConsumer = async () => {
    const connection = await (0, connect_1.connectRabbitMQ)();
    const channel = await connection.createChannel();
    await channel.assertExchange("payments_exchange", "topic", { durable: true });
    const q = await channel.assertQueue("booking_payment_queue", { durable: true });
    await channel.bindQueue(q.queue, "payments_exchange", "payment.*");
    channel.consume(q.queue, async (msg) => {
        if (!msg)
            return;
        try {
            const event = JSON.parse(msg.content.toString());
            const routingKey = msg.fields.routingKey;
            if (routingKey === "payment.success") {
                await Booking_1.Booking.findByIdAndUpdate(event.bookingId, {
                    status: "confirmed",
                    paymentId: event.paymentId,
                });
                // schedule return job logic here...
            }
            else if (routingKey === "payment.failed") {
                await Booking_1.Booking.findByIdAndUpdate(event.bookingId, { status: "failed" });
            }
        }
        catch (err) {
            console.error("❌ booking consumer error:", err.message || err);
        }
        finally {
            channel.ack(msg);
        }
    });
    console.log("✅ Booking consumer started");
};
exports.startBookingConsumer = startBookingConsumer;
