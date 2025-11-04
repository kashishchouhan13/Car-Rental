import { redisClient } from "../../redis";
import { Car } from "../../models/car";
import { GetAvailableCarsQuery } from "../GetAvailableCars.ts/GetAvailbleCarsQuery";

export class GetAvailableCarsHandler {
  async execute(query: GetAvailableCarsQuery) {
    try {
      const carsObj = await redisClient.hgetall("availableCars");
      let cars = Object.values(carsObj).map((c) => JSON.parse(c));

      // If Redis empty, fetch from MongoDB
      if (cars.length === 0) {
        cars = await Car.find({ available: true });

        // Store in Redis 
        for (const car of cars) {
          await redisClient.hset("availableCars", car.id, JSON.stringify(car));
        }
      }
      return cars;
    } catch (error: any) {
      console.error("Error ", error.message);
      throw new Error("Failed to fetch available cars");
    }
  }
}
