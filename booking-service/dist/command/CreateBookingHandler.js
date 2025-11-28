"use strict";
// import { CreateBookingCommand } from "../command/CreateBookingCommand";
// import { redisClient } from "../redis/client";
// import { publishCarBooked } from "../events/publishCarBooked";
// import { Booking } from "../models/Booking";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateBookingHandler = void 0;
// export class CreateBookingHandler {
//   async execute(command: CreateBookingCommand) {
//     const { userId, carId, startDate, endDate, amount } = command;
//     const carStr = await redisClient.hget("availableCars", carId);
//     if (!carStr) throw new Error("Car not found");
//     const car = JSON.parse(carStr);
//     if (!car.available) throw new Error("Car already booked");
//  //  Save in mongo
//     const booking = await Booking.create({
//       userId,
//       carId,
//       startDate,
//       endDate,
//       amount,
//       status: "pending",
//       createdAt: new Date(),
//     });
//     await publishCarBooked({
//       bookingId: booking._id,
//       userId,
//       carId,
//       amount,
//     });
//     return {
//       message: "Booking created. Awaiting payment confirmation.",
//       bookingId: booking._id,
//     };
//   }
// }
const mongoose_1 = __importDefault(require("mongoose"));
const axios_1 = __importDefault(require("axios"));
const client_1 = require("../redis/client");
const publishCarBooked_1 = require("../events/publishCarBooked");
const Booking_1 = require("../models/Booking");
class CreateBookingHandler {
    async execute(command) {
        const { userId, carId, startDate, endDate, amount } = command;
        // 1️⃣ Try Redis first
        let carStr = await client_1.redisClient.hget("availableCars", carId);
        if (!carStr) {
            console.log("⚠️ Car not found in Redis → Fetching from Car-Service");
            try {
                const carRes = await axios_1.default.get(`http://localhost:5002/api/car/query/${carId}`);
                if (!carRes.data.success || !carRes.data.car) {
                    throw new Error("Car not found");
                }
                carStr = JSON.stringify(carRes.data.car);
                // Restore to Redis
                await client_1.redisClient.hset("availableCars", carId, carStr);
                console.log("✅ Car cached in Redis");
            }
            catch (_a) {
                throw new Error("Car not found");
            }
        }
        const car = JSON.parse(carStr);
        // 3️⃣ Availability check
        if (!car.available)
            throw new Error("Car already booked");
        // 4️⃣ Convert IDs to ObjectId
        const mongoUserId = new mongoose_1.default.Types.ObjectId(userId);
        const mongoCarId = new mongoose_1.default.Types.ObjectId(carId);
        // 5️⃣ Save booking in Mongo
        const booking = await Booking_1.Booking.create({
            userId: mongoUserId,
            carId: mongoCarId,
            startDate,
            endDate,
            amount,
            status: "pending",
            createdAt: new Date(),
        });
        // 6️⃣ Publish event
        await (0, publishCarBooked_1.publishCarBooked)({
            bookingId: booking._id,
            userId,
            carId,
            amount,
        });
        return {
            success: true,
            booking: booking.toObject(),
        };
    }
}
exports.CreateBookingHandler = CreateBookingHandler;
