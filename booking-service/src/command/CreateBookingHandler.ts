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
import axios from "axios";
import { CreateBookingCommand } from "../command/CreateBookingCommand";
import { redisClient } from "../redis/client";
import { publishCarBooked } from "../events/publishCarBooked";
import { Booking } from "../models/Booking";

export class CreateBookingHandler {
  async execute(command: CreateBookingCommand) {
    const { userId, carId, startDate, endDate, amount } = command;

    // 1️⃣ Try Redis first
    let carStr = await redisClient.hget("availableCars", carId);

if (!carStr) {
  console.log("⚠️ Car not found in Redis → Fetching from Car-Service");

  try {
    interface CarByIdResponse {
      success: boolean;
      car: any;
    }

    const carRes = await axios.get<CarByIdResponse>(
      `http://localhost:5002/api/car/query/${carId}`
    );

    if (!carRes.data.success || !carRes.data.car) {
      throw new Error("Car not found");
    }

    carStr = JSON.stringify(carRes.data.car);

    // Restore to Redis
    await redisClient.hset("availableCars", carId, carStr);

    console.log("✅ Car cached in Redis");
  } catch {
    throw new Error("Car not found");
  }
}


    const car = JSON.parse(carStr);

    // 3️⃣ Availability check
    if (!car.available) throw new Error("Car already booked");

    // 4️⃣ Convert IDs to ObjectId
    const mongoUserId = new mongoose.Types.ObjectId(userId);
    const mongoCarId = new mongoose.Types.ObjectId(carId);

    // 5️⃣ Save booking in Mongo
    const booking = await Booking.create({
      userId: mongoUserId,
      carId: mongoCarId,
      startDate,
      endDate,
      amount,
      status: "pending",
      createdAt: new Date(),
    });

    // 6️⃣ Publish event
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
