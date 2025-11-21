"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateBookingHandler = void 0;
const client_1 = require("../redis/client");
const publishCarBooked_1 = require("../events/publishCarBooked");
const Booking_1 = require("../models/Booking");
class CreateBookingHandler {
    async execute(command) {
        const { userId, carId, startDate, endDate, amount } = command;
        const carStr = await client_1.redisClient.hget("availableCars", carId);
        if (!carStr)
            throw new Error("Car not found");
        const car = JSON.parse(carStr);
        if (!car.available)
            throw new Error("Car already booked");
        //  Save in mongo
        const booking = await Booking_1.Booking.create({
            userId,
            carId,
            startDate,
            endDate,
            amount,
            status: "pending",
            createdAt: new Date(),
        });
        await (0, publishCarBooked_1.publishCarBooked)({
            bookingId: booking._id,
            userId,
            carId,
            amount,
        });
        return {
            message: "Booking created. Awaiting payment confirmation.",
            bookingId: booking._id,
        };
    }
}
exports.CreateBookingHandler = CreateBookingHandler;
