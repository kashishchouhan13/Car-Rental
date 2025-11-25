"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startBookingConsumer = void 0;
const connect_1 = require("../rabbitmq/connect");
const Booking_1 = require("../models/Booking");
const returnCarQueue_1 = require("../returnCarQueue");
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
            // if (routingKey === "payment.success") {
            //   await Booking.findByIdAndUpdate(event.bookingId, {
            //     status: "confirmed",
            //     paymentId: event.paymentId,
            //   });
            //   // schedule return job logic here...
            // } 
            if (routingKey === "payment.success") {
                const booking = await Booking_1.Booking.findByIdAndUpdate(event.bookingId, {
                    status: "confirmed",
                    paymentId: event.paymentId,
                }, { new: true });
                if (booking) {
                    console.log("🎯 DEBUG booking:", booking);
                    console.log("startDate:", booking.startDate);
                    console.log("endDate:", booking.endDate);
                    const endTime = new Date(booking.endDate).getTime();
                    const now = Date.now();
                    console.log("endTime(ms):", endTime);
                    console.log("now(ms):", now);
                    const delay = Math.max(0, endTime - now);
                    console.log("🧮 Calculated delay:", delay);
                    await returnCarQueue_1.returnCarQueue.add("return-car", { carId: booking.carId.toString() }, { delay });
                }
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
