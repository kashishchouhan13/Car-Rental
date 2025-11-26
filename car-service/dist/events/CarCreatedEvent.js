"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarCreatedEvent = void 0;
class CarCreatedEvent {
    constructor(id, name, model, pricePerDay, available, imageUrl) {
        this.id = id;
        this.name = name;
        this.model = model;
        this.pricePerDay = pricePerDay;
        this.available = available;
        this.imageUrl = imageUrl;
    }
}
exports.CarCreatedEvent = CarCreatedEvent;
