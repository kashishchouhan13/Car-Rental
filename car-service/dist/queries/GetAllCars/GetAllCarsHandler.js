"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllCarsHandler = void 0;
const car_1 = require("../../models/car");
class GetAllCarsHandler {
    async execute(query) {
        const cars = await car_1.Car.find();
        return cars;
    }
}
exports.GetAllCarsHandler = GetAllCarsHandler;
