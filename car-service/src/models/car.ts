import mongoose from "mongoose";

export interface ICar {
  model: string;
  brand: string;
  pricePerDay: number;
  available: boolean;
}

const carSchema = new mongoose.Schema({
  model: { type: String, required: true },
  brand: { type: String, required: true },
  pricePerDay: { type: Number, required: true },
  available: { type: Boolean, default: true },
}, { timestamps: true });

export const Car = mongoose.model("Car", carSchema);
