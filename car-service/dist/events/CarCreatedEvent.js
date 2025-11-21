"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarCreatedEvent = void 0;
class CarCreatedEvent {
    constructor(id, name, model, pricePerDay, available) {
        this.id = id;
        this.name = name;
        this.model = model;
        this.pricePerDay = pricePerDay;
        this.available = available;
    }
}
exports.CarCreatedEvent = CarCreatedEvent;
