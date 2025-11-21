"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateBookingCommand = void 0;
class CreateBookingCommand {
    constructor(userId, carId, startDate, endDate, amount) {
        this.userId = userId;
        this.carId = carId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.amount = amount;
    }
}
exports.CreateBookingCommand = CreateBookingCommand;
