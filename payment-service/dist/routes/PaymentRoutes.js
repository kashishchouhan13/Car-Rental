"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripe = void 0;
const express_1 = __importDefault(require("express"));
const stripe_1 = __importDefault(require("stripe"));
const router = express_1.default.Router();
exports.stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY);
// CREATE CHECKOUT SESSION
router.post("/checkout", async (req, res) => {
    try {
        const { amount, bookingId, carId } = req.body;
        if (!amount || !bookingId) {
            return res.status(400).json({ success: false, message: "Missing data" });
        }
        if (amount < 50) {
            return res.status(400).json({
                success: false,
                message: "Amount must be at least ₹50 for Stripe checkout."
            });
        }
        const session = await exports.stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            expand: ["payment_intent"],
            line_items: [
                {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: `Car Booking #${bookingId}`,
                        },
                        unit_amount: Math.round(amount * 100),
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            // Stripe UI
            success_url: "http://localhost:5173/payment/success",
            cancel_url: "http://localhost:5173/payment/failed",
            metadata: {
                bookingId,
                carId,
            },
            payment_intent_data: {
                setup_future_usage: "off_session",
                metadata: {
                    bookingId,
                    carId,
                },
            },
        });
        res.json({ success: true, url: session.url });
    }
    catch (err) {
        console.error("Stripe Checkout Error:", err);
        res.status(500).json({ success: false, message: err.message });
    }
});
exports.default = router;
