"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const CreateBookingCommand_1 = require("../command/CreateBookingCommand");
const CreateBookingHandler_1 = require("../command/CreateBookingHandler");
const Booking_1 = require("../models/Booking");
const router = express_1.default.Router();
router.post("/", async (req, res) => {
    var _a;
    try {
        const { userId, carId, startDate, endDate, amount } = req.body;
        console.log("📥 Received Booking Request:", req.body);
        // 1️⃣ Create booking
        const handler = new CreateBookingHandler_1.CreateBookingHandler();
        const bookingResponse = await handler.execute(new CreateBookingCommand_1.CreateBookingCommand(userId, carId, startDate, endDate, amount));
        const booking = bookingResponse.booking;
        // 2️⃣ Ask payment-service for Stripe URL
        const stripeResponse = await axios_1.default.post("http://host.docker.internal:5004/api/pay/checkout", {
            bookingId: booking._id,
            amount,
            carId: carId,
        });
        // 3️⃣ Return Stripe URL to frontend
        return res.json({
            success: true,
            url: stripeResponse.data.url
        });
    }
    catch (err) {
        console.log("❌ Booking+Payment Error:", ((_a = err.response) === null || _a === void 0 ? void 0 : _a.data) || err.message);
        return res.status(500).json({
            success: false,
            message: err.message
        });
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
router.get("/status/:id", async (req, res) => {
    const booking = await Booking_1.Booking.findById(req.params.id);
    if (!booking)
        return res.status(404).json({ status: "not_found" });
    return res.json({ status: booking.status });
});
exports.default = router;
