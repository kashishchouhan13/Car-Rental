"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.returnCarWorker = void 0;
const bullmq_1 = require("bullmq");
const publishCarReturn_1 = require("./events/publishCarReturn");
exports.returnCarWorker = new bullmq_1.Worker("return-car-queue", async (job) => {
    const { carId } = job.data;
    await (0, publishCarReturn_1.publishCarReturned)(carId);
}, {
    connection: {
        host: "redis",
        port: 6379,
        maxRetriesPerRequest: null
    }
});
