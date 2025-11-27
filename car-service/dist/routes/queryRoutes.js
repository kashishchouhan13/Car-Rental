"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const GetAllCarsQuery_1 = require("../queries/GetAllCars/GetAllCarsQuery");
const GetAllCarsHandler_1 = require("../queries/GetAllCars/GetAllCarsHandler");
const GetCarByIdQuery_1 = require("../queries/GetCarById/GetCarByIdQuery");
const GetCarByIdHandler_1 = require("../queries/GetCarById/GetCarByIdHandler");
const GetAvailbleCarsQuery_1 = require("../queries/GetAvailableCars.ts/GetAvailbleCarsQuery");
const GetAvailableCarsHandler_1 = require("../queries/GetAvailableCars.ts/GetAvailableCarsHandler");
const car_1 = require("../models/car");
const router = express_1.default.Router();
router.get("/all", async (req, res) => {
    try {
        const query = new GetAllCarsQuery_1.GetAllCarsQuery();
        const handler = new GetAllCarsHandler_1.GetAllCarsHandler();
        const result = await handler.execute(query);
        res.json({ success: true, data: result });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});
router.get("/available", async (req, res) => {
    try {
        const query = new GetAvailbleCarsQuery_1.GetAvailableCarsQuery();
        const handler = new GetAvailableCarsHandler_1.GetAvailableCarsHandler();
        const result = await handler.execute(query);
        res.json({ success: true, data: result });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});
router.get("/paginated", async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const cars = await car_1.Car.find({ available: true }) // 🔥 FILTER ADDED
            .skip(skip)
            .limit(limit);
        const total = await car_1.Car.countDocuments({ available: true });
        res.json({
            success: true,
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            data: cars,
        });
    }
    catch (err) {
        res.status(500).json({ success: false });
    }
});
router.get("/:id", async (req, res) => {
    try {
        const query = new GetCarByIdQuery_1.GetCarByIdQuery(req.params.id);
        const handler = new GetCarByIdHandler_1.GetCarByIdHandler();
        const car = await handler.execute(query);
        res.json({ success: true, car });
    }
    catch (err) {
        res.status(404).json({ success: false, message: err.message });
    }
});
exports.default = router;
