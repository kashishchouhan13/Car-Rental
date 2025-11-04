import { Queue } from "bullmq";

export const returnCarQueue = new Queue ("return-car-queue", {connection: {
      host: "redis",   
      port: 6379,        
      maxRetriesPerRequest: null}
    })