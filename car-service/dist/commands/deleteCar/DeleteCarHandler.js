"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteCarHandler = void 0;
const car_1 = require("../../models/car");
const redis_1 = require("../../redis");
class DeleteCarHandler {
    async execute(command) {
        const { carId } = command;
        const deletedCar = await car_1.Car.findByIdAndDelete(carId);
        if (!deletedCar) {
            throw new Error("Car not found");
        }
        const exists = await redis_1.redisClient.hget("availableCars", carId);
        if (exists) {
            await redis_1.redisClient.hdel("availableCars", carId);
        }
        return { message: "Car deleted successfully", deletedCar };
    }
}
exports.DeleteCarHandler = DeleteCarHandler;
