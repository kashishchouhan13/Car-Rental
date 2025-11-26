import express from "express";
import axios from "axios";
import { CreateBookingCommand } from "../command/CreateBookingCommand";
import { CreateBookingHandler } from "../command/CreateBookingHandler";
import { Booking } from "../models/Booking";

interface StripeSessionResponse {
  url: string;
}

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { userId, carId, startDate, endDate, amount } = req.body;

    console.log("📥 Received Booking Request:", req.body);

    // 1️⃣ Create booking
    const handler = new CreateBookingHandler();
    const bookingResponse = await handler.execute(
      new CreateBookingCommand(userId, carId, startDate, endDate, amount)
    );

    const booking = bookingResponse.booking;

    // 2️⃣ Ask payment-service for Stripe URL
    const stripeResponse = await axios.post<StripeSessionResponse>(
      "http://host.docker.internal:5004/api/pay/checkout",
      {
        bookingId: booking._id,
        amount,
        carId: carId,
      }
    );

    // 3️⃣ Return Stripe URL to frontend
    return res.json({
      success: true,
      url: stripeResponse.data.url
    });

  } catch (err: any) {
    console.log("❌ Booking+Payment Error:", err.response?.data || err.message);
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
});


router.get("/all", async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json({ success: true, bookings });
    
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch all bookings for this user
    const bookings = await Booking.find({ userId });

    return res.json({
      success: true,
      data: bookings,
    });

  } catch (err: any) {
    return res
      .status(500)
      .json({ success: false, message: err.message });
  }
});
router.get("/status/:id", async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking)
    return res.status(404).json({ status: "not_found" });

  return res.json({ status: booking.status });
});

export default router;
