// import { CreateBookingCommand } from "../command/CreateBookingCommand";
// import { redisClient } from "../redis/client";
// import { publishCarBooked } from "../events/publishCarBooked";
// import { Booking } from "../models/Booking";

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

import mongoose from "mongoose";
import { CreateBookingCommand } from "../command/CreateBookingCommand";
import { redisClient } from "../redis/client";
import { publishCarBooked } from "../events/publishCarBooked";
import { Booking } from "../models/Booking";

export class CreateBookingHandler {
  async execute(command: CreateBookingCommand) {
    const { userId, carId, startDate, endDate, amount } = command;

    const carStr = await redisClient.hget("availableCars", carId);
    if (!carStr) throw new Error("Car not found");

    const car = JSON.parse(carStr);
    if (!car.available) throw new Error("Car already booked");

    // ⭐ FIX: Convert IDs to ObjectId
    const mongoUserId = new mongoose.Types.ObjectId(userId);
    const mongoCarId = new mongoose.Types.ObjectId(carId);

    // ⭐ Save in MongoDB with ObjectId refs
    const booking = await Booking.create({
      userId: mongoUserId,
      carId: mongoCarId,
      startDate,
      endDate,
      amount,
      status: "pending",
      createdAt: new Date(),
    });

    // Publish event
    await publishCarBooked({
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
