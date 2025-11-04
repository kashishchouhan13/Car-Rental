import express from "express";
import { GetAllCarsQuery } from "../queries/GetAllCars/GetAllCarsQuery";
import { GetAllCarsHandler } from "../queries/GetAllCars/GetAllCarsHandler";

import { GetCarByIdQuery } from "../queries/GetCarById/GetCarByIdQuery";
import { GetCarByIdHandler } from "../queries/GetCarById/GetCarByIdHandler";

import { GetAvailableCarsQuery } from "../queries/GetAvailableCars.ts/GetAvailbleCarsQuery";
import { GetAvailableCarsHandler } from "../queries/GetAvailableCars.ts/GetAvailableCarsHandler";

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
