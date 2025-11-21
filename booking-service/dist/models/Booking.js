"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Booking = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const bookingSchema = new mongoose_1.default.Schema({
    userId: { type: String, required: true }, // FIXED
    carId: { type: String, required: true }, // FIXED
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    amount: { type: Number, required: true },
    status: {
        type: String,
        enum: ["pending", "confirmed", "failed"],
        default: "pending",
    },
    paymentId: { type: String },
}, { timestamps: true });
exports.Booking = mongoose_1.default.model("Booking", bookingSchema);
