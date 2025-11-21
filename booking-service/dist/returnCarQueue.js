"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.returnCarQueue = void 0;
const bullmq_1 = require("bullmq");
exports.returnCarQueue = new bullmq_1.Queue("return-car-queue", { connection: {
        host: "redis",
        port: 6379,
        maxRetriesPerRequest: null
    }
});
