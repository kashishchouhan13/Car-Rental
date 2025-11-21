"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAvailableCarsHandler = void 0;
const redis_1 = require("../../redis");
const car_1 = require("../../models/car");
class GetAvailableCarsHandler {
    async execute(query) {
        try {
            const carsObj = await redis_1.redisClient.hgetall("availableCars");
            let cars = Object.values(carsObj).map((c) => JSON.parse(c));
            // If Redis empty, fetch from MongoDB
            if (cars.length === 0) {
                cars = await car_1.Car.find({ available: true });
                // Store in Redis 
                for (const car of cars) {
                    await redis_1.redisClient.hset("availableCars", car.id, JSON.stringify(car));
                }
            }
            return cars;
        }
        catch (error) {
            console.error("Error ", error.message);
            throw new Error("Failed to fetch available cars");
        }
    }
}
exports.GetAvailableCarsHandler = GetAvailableCarsHandler;
