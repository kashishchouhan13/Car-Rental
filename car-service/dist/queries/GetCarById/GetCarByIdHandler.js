"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCarByIdHandler = void 0;
const car_1 = require("../../models/car");
class GetCarByIdHandler {
    async execute(query) {
        const car = await car_1.Car.findById(query.id);
        if (!car)
            throw new Error("Car not found");
        return car;
    }
}
exports.GetCarByIdHandler = GetCarByIdHandler;
