"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddCarCommand = void 0;
class AddCarCommand {
    constructor(name, model, pricePerDay, imageUrl) {
        this.name = name;
        this.model = model;
        this.pricePerDay = pricePerDay;
        this.imageUrl = imageUrl;
    }
}
exports.AddCarCommand = AddCarCommand;
