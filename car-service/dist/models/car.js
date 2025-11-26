"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Car = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const carSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    model: { type: String, required: true },
    pricePerDay: { type: Number, required: true },
    available: { type: Boolean, default: true },
    imageUrl: { type: [String], required: true },
}, { timestamps: true });
exports.Car = mongoose_1.default.model("Car", carSchema);
