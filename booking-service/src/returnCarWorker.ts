import { Worker } from "bullmq";
import { publishCarReturned } from "./events/publishCarReturn";

export const returnCarWorker= new Worker( "return-car-queue",
    async (job)=>{
        const {carId}=job.data;
        await publishCarReturned(carId);
    },{
    connection: {
      host: "redis",  
      port: 6379,         
      maxRetriesPerRequest: null
    }
  }
);
