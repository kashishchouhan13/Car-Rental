import express from "express";
import { GetAllCarsQuery } from "../queries/GetAllCars/GetAllCarsQuery";
import { GetAllCarsHandler } from "../queries/GetAllCars/GetAllCarsHandler";

import { GetCarByIdQuery } from "../queries/GetCarById/GetCarByIdQuery";
import { GetCarByIdHandler } from "../queries/GetCarById/GetCarByIdHandler";

import { GetAvailableCarsQuery } from "../queries/GetAvailableCars.ts/GetAvailbleCarsQuery";
import { GetAvailableCarsHandler } from "../queries/GetAvailableCars.ts/GetAvailableCarsHandler";
import { Car } from "../models/car";

const router = express.Router();

router.get("/all", async (req, res) => {
  try {
    const query = new GetAllCarsQuery();
    const handler = new GetAllCarsHandler();
    const result = await handler.execute(query);
    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});
router.get("/available", async (req, res) => {
  try {
    const query = new GetAvailableCarsQuery();
    const handler = new GetAvailableCarsHandler();
    const result = await handler.execute(query);
    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});
router.get("/paginated", async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 6;

    const skip = (page - 1) * limit;

    const [cars, total] = await Promise.all([
      Car.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
      Car.countDocuments()
    ]);

    res.json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: cars,
    });

  } catch (err) {
    res.status(500).json({ success: false});
  }
});

router.get("/:id", async (req, res) => {
  try {
    const query = new GetCarByIdQuery(req.params.id);
    const handler = new GetCarByIdHandler();
    const car = await handler.execute(query);
    res.json({ success: true, car });
  } catch (err: any) {
    res.status(404).json({ success: false, message: err.message });
  }
});



export default router;
