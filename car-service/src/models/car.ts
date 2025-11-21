import mongoose from "mongoose";

export interface ICar {
  name: string;
  model: string;
  pricePerDay: number;
  available: boolean;
  imageUrl: string[];
}

const carSchema = new mongoose.Schema({
  name: { type: String, required: true },
  model: { type: String, required: true },
  pricePerDay: { type: Number, required: true },
  available: { type: Boolean, default: true },
  imageUrl: { type: [String], required: true },
}, { timestamps: true });

export const Car = mongoose.model("Car", carSchema);
