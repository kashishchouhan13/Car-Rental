import express from "express";
import Stripe from "stripe";
import { publishPaymentSuccess } from "./publisher/publishPaymentSuccess";
import { publishPaymentFailed } from "./publisher/publishPaymentFailure";

const router = express.Router();
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

router.post("/", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"] as string;

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    if (event.type === "checkout.session.completed") {
      const session: any = event.data.object;

      const bookingId = session.metadata.bookingId;
      const paymentId = session.payment_intent;
      console.log()
     
      await publishPaymentSuccess({
        bookingId,
        paymentId,
        carId: session.metadata.carId,
        amount: session.amount_total / 100,
      });
    }
     if (event.type === "payment_intent.payment_failed") {
      const intent: any = event.data.object;

      const bookingId = intent.metadata.bookingId;

      console.log(" PAYMENT FAILED FOR:", bookingId);

      await publishPaymentFailed({
        bookingId,
        paymentId: intent.id,
      });
    }

    res.json({ received: true });
  } catch (err: any) {
    console.error(" Webhook Error:", err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

export default router;
