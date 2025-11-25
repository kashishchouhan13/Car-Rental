"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const CreateBookingCommand_1 = require("../command/CreateBookingCommand");
const CreateBookingHandler_1 = require("../command/CreateBookingHandler");
const Booking_1 = require("../models/Booking");
const router = express_1.default.Router();
router.post("/", async (req, res) => {
    try {
        const { userId, carId, startDate, endDate, amount } = req.body;
        const command = new CreateBookingCommand_1.CreateBookingCommand(userId, carId, startDate, endDate, amount);
        const handler = new CreateBookingHandler_1.CreateBookingHandler();
        const booking = await handler.execute(command);
        res.json({ success: true, booking });
    }
    catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});
router.get("/all", async (req, res) => {
    try {
        const bookings = await Booking_1.Booking.find();
        res.json({ success: true, bookings });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});
router.get("/user/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        // Fetch all bookings for this user
        const bookings = await Booking_1.Booking.find({ userId });
        return res.json({
            success: true,
            data: bookings,
        });
    }
    catch (err) {
        return res
            .status(500)
            .json({ success: false, message: err.message });
    }
});
exports.default = router;
