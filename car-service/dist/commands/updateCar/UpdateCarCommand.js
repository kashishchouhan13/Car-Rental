"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCarCommand = void 0;
class UpdateCarCommand {
    constructor(_id, model, name, pricePerDay, available, imageUrl) {
        this._id = _id;
        this.model = model;
        this.name = name;
        this.pricePerDay = pricePerDay;
        this.available = available;
        this.imageUrl = imageUrl;
    }
}
exports.UpdateCarCommand = UpdateCarCommand;
