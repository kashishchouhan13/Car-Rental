"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCarCommand = void 0;
class UpdateCarCommand {
    constructor(id, model, brand, pricePerDay, available) {
        this.id = id;
        this.model = model;
        this.brand = brand;
        this.pricePerDay = pricePerDay;
        this.available = available;
    }
}
exports.UpdateCarCommand = UpdateCarCommand;
