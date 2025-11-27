"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripe = void 0;
const express_1 = __importDefault(require("express"));
const stripe_1 = __importDefault(require("stripe"));
const publishPaymentSuccess_1 = require("./publisher/publishPaymentSuccess");
const publishPaymentFailure_1 = require("./publisher/publishPaymentFailure");
const router = express_1.default.Router();
exports.stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY);
router.post("/", express_1.default.raw({ type: "application/json" }), async (req, res) => {
    const sig = req.headers["stripe-signature"];
    try {
        const event = exports.stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
        if (event.type === "checkout.session.completed") {
            const session = event.data.object;
            const bookingId = session.metadata.bookingId;
            const paymentId = session.payment_intent;
            console.log();
            await (0, publishPaymentSuccess_1.publishPaymentSuccess)({
                bookingId,
                paymentId,
                carId: session.metadata.carId,
                amount: session.amount_total / 100,
            });
        }
        if (event.type === "payment_intent.payment_failed") {
            const intent = event.data.object;
            const bookingId = intent.metadata.bookingId;
            console.log(" PAYMENT FAILED FOR:", bookingId);
            await (0, publishPaymentFailure_1.publishPaymentFailed)({
                bookingId,
                paymentId: intent.id,
            });
        }
        res.json({ received: true });
    }
    catch (err) {
        console.error(" Webhook Error:", err.message);
        res.status(400).send(`Webhook Error: ${err.message}`);
    }
});
exports.default = router;
