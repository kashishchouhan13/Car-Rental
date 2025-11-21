import express from "express";
import { AddCarCommand } from "../commands/addCar/AddCarCommand";
import { AddCarHandler } from "../commands/addCar/AddCarHandler";

import { UpdateCarCommand } from "../commands/updateCar/UpdateCarCommand";
import { UpdateCarHandler } from "../commands/updateCar/UpdateCarHandler";

import { DeleteCarCommand } from "../commands/deleteCar/DeleteCarCommand";
import { DeleteCarHandler } from "../commands/deleteCar/DeleteCarHandler";

import { requireAdmin } from "../middleware/adminMiddleware";
//import { upload } from "../middleware/upload";

const router = express.Router();
import multer from "multer";
import path from "path";

// Storage config
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const carImageUpload = multer({ storage });

router.post(
  "/upload-images",
  requireAdmin,
  carImageUpload.array("images", 5), 
  (req, res) => {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0)
      return res
        .status(400)
        .json({ success: false, message: "No files uploaded" });

    const urls = files.map((file) => `/uploads/${file.filename}`);
    return res.json({ success: true, urls });
  }
);

router.post("/add", requireAdmin, async (req, res) => {
  try {
    const { name, model, pricePerDay, imageUrl } = req.body;

    if (!Array.isArray(imageUrl)) {
      return res.status(400).json({ success: false, message: "imageUrl must be an array" });
    }

    const command = new AddCarCommand(name, model, pricePerDay, imageUrl);
    const handler = new AddCarHandler();

    const car = await handler.execute(command, (req as any).user);

    return res.status(201).json({ success: true, data: car });
  } catch (err: any) {
    return res.status(400).json({ success: false, message: err.message });
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
