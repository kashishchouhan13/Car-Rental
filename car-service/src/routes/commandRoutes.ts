import express from "express";
import { AddCarCommand } from "../commands/addCar/AddCarCommand";
import { AddCarHandler } from "../commands/addCar/AddCarHandler";

import { UpdateCarCommand } from "../commands/updateCar/UpdateCarCommand";
import { UpdateCarHandler } from "../commands/updateCar/UpdateCarHandler";

import { DeleteCarCommand } from "../commands/deleteCar/DeleteCarCommand";
import { DeleteCarHandler } from "../commands/deleteCar/DeleteCarHandler";

import { requireAdmin } from "../middleware/adminMiddleware";

const router = express.Router();

router.post("/add", requireAdmin, async (req, res) => {
  try {
    const { model, brand, pricePerDay } = req.body;
    const command = new AddCarCommand(model, brand, pricePerDay);
    const handler = new AddCarHandler();
    const car = await handler.execute(command , (req as any).user);
    res.status(201).json({ success: true, data: car });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.put("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { model, brand, pricePerDay, available } = req.body;
    const command = new UpdateCarCommand(id, model, brand, pricePerDay, available);
    const handler = new UpdateCarHandler();
    const updatedCar = await handler.execute(command);
    res.json({ success: true, car: updatedCar });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const command = new DeleteCarCommand(req.params.id);
    const handler = new DeleteCarHandler();
    const result = await handler.execute(command);
    res.status(200).json(result);
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
});

export default router;
