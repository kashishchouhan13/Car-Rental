"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarCreatedEvent = void 0;
class CarCreatedEvent {
    constructor(_id, name, model, pricePerDay, available, imageUrl) {
        this._id = _id;
        this.name = name;
        this.model = model;
        this.pricePerDay = pricePerDay;
        this.available = available;
        this.imageUrl = imageUrl;
    }
}
exports.CarCreatedEvent = CarCreatedEvent;
