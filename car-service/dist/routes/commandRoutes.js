"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AddCarCommand_1 = require("../commands/addCar/AddCarCommand");
const AddCarHandler_1 = require("../commands/addCar/AddCarHandler");
const UpdateCarCommand_1 = require("../commands/updateCar/UpdateCarCommand");
const UpdateCarHandler_1 = require("../commands/updateCar/UpdateCarHandler");
const DeleteCarCommand_1 = require("../commands/deleteCar/DeleteCarCommand");
const DeleteCarHandler_1 = require("../commands/deleteCar/DeleteCarHandler");
const adminMiddleware_1 = require("../middleware/adminMiddleware");
const router = express_1.default.Router();
router.post("/add", adminMiddleware_1.requireAdmin, async (req, res) => {
    try {
        const { name, model, pricePerDay } = req.body;
        const command = new AddCarCommand_1.AddCarCommand(name, model, pricePerDay);
        const handler = new AddCarHandler_1.AddCarHandler();
        const car = await handler.execute(command, req.user);
        res.status(201).json({ success: true, data: car });
    }
    catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});
router.put("/update/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { model, brand, pricePerDay, available } = req.body;
        const command = new UpdateCarCommand_1.UpdateCarCommand(id, model, brand, pricePerDay, available);
        const handler = new UpdateCarHandler_1.UpdateCarHandler();
        const updatedCar = await handler.execute(command);
        res.json({ success: true, car: updatedCar });
    }
    catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});
router.delete("/:id", async (req, res) => {
    try {
        const command = new DeleteCarCommand_1.DeleteCarCommand(req.params.id);
        const handler = new DeleteCarHandler_1.DeleteCarHandler();
        const result = await handler.execute(command);
        res.status(200).json(result);
    }
    catch (err) {
        res.status(404).json({ error: err.message });
    }
});
exports.default = router;
