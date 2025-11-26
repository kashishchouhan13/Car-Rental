"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddCarHandler = void 0;
const car_1 = require("../../models/car");
const CarCreatedEvent_1 = require("../../events/CarCreatedEvent");
const producer_1 = require("../../rabbitmq/producer");
class AddCarHandler {
    async execute(command, user) {
        if (user.role !== "admin") {
            throw new Error("Only admins can add cars");
        }
        const car = new car_1.Car({
            name: command.name,
            model: command.model,
            pricePerDay: command.pricePerDay,
            imageUrl: command.imageUrl
        });
        await car.save();
        const event = new CarCreatedEvent_1.CarCreatedEvent(car._id.toString(), car.name, car.model, car.pricePerDay, car.available, car.imageUrl);
        await (0, producer_1.publishEvent)("car_exchange", "car.created", event);
        return car;
    }
}
exports.AddCarHandler = AddCarHandler;
