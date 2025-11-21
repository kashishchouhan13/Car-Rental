"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCarHandler = void 0;
const car_1 = require("../../models/car");
const producer_1 = require("../../rabbitmq/producer");
class UpdateCarHandler {
    async execute(command) {
        const car = await car_1.Car.findById(command.id) || null;
        if (!car)
            throw new Error("Car not found");
        if (command.model !== undefined)
            car.model = command.model;
        if (command.brand !== undefined)
            car.brand = command.brand;
        if (command.pricePerDay !== undefined)
            car.pricePerDay = command.pricePerDay;
        if (command.available !== undefined)
            car.available = command.available;
        await car.save();
        // Publish event to RabbitMQ
        await (0, producer_1.publishEvent)("car_exchange", "car.updated", {
            id: car._id,
            model: car.model,
            brand: car.brand,
            pricePerDay: car.pricePerDay,
            available: car.available,
        });
        return car;
    }
}
exports.UpdateCarHandler = UpdateCarHandler;
