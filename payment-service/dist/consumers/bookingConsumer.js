"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startBookingConsumer = void 0;
const amqplib_1 = __importDefault(require("amqplib"));
const publishPaymentSuccess_1 = require("../publisher/publishPaymentSuccess");
const connectRabbitMQ = async () => {
    let connection;
    while (!connection) {
        try {
            connection = await amqplib_1.default.connect(process.env.RABBITMQ_URL);
            console.log(" RabbitMQ connected");
        }
        catch (err) {
            console.log(" Waiting for RabbitMQ...");
            await new Promise(res => setTimeout(res, 3000));
        }
    }
    return connection;
};
const startBookingConsumer = async () => {
    const connection = await connectRabbitMQ();
    const channel = await connection.createChannel();
    const exchange = "payments_exchange";
    await channel.assertExchange(exchange, "topic", { durable: true });
    const q = await channel.assertQueue("", { exclusive: true });
    await channel.bindQueue(q.queue, exchange, "payment.initiate");
    channel.consume(q.queue, async (msg) => {
        if (msg) {
            const bookingData = JSON.parse(msg.content.toString());
            console.log(" Received payment request for booking:", bookingData);
            //  Mock payment logic 
            const paymentSucceeded = true;
            if (paymentSucceeded) {
                console.log(` Payment succeeded for booking ${bookingData.bookingId}`);
                // Publish payment success using booking
                await (0, publishPaymentSuccess_1.publishPaymentSuccess)({
                    bookingId: bookingData.bookingId,
                    carId: bookingData.carId,
                    paymentId: `PAY-${Math.floor(Math.random() * 100000)}`,
                });
                channel.ack(msg);
            }
            else {
                console.log(`Payment failed for booking ${bookingData.bookingId}`);
            }
        }
    });
};
exports.startBookingConsumer = startBookingConsumer;
