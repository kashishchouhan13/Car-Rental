import mongoose from "mongoose";

export interface IBooking {
  userId: mongoose.Types.ObjectId;
  carId: mongoose.Types.ObjectId;
  startDate: Date;
  endDate: Date;
  amount: number;
  status: "pending" | "confirmed" | "failed";
  paymentId: string;
}

const bookingSchema = new mongoose.Schema<IBooking>(
  {
userId: { type: mongoose.Schema.Types.ObjectId, required: true },
carId: { type: mongoose.Schema.Types.ObjectId, required: true },


    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },

    amount: { type: Number, required: true },

    status: {
      type: String,
      enum: ["pending", "confirmed", "failed"],
      default: "pending",
    },

    paymentId: { type: String },
  },
  { timestamps: true }
);

export const Booking = mongoose.model("Booking", bookingSchema);
