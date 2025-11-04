import { DeleteCarCommand } from "../deleteCar/DeleteCarCommand";
import { Car } from "../../models/car";
import { redisClient } from "../../redis"; 

export class DeleteCarHandler {
  async execute(command: DeleteCarCommand) {
    const { carId } = command;

    const deletedCar = await Car.findByIdAndDelete(carId);
    if (!deletedCar) {
      throw new Error("Car not found");
    }

    const exists = await redisClient.hget("availableCars", carId);
    if (exists) {
      await redisClient.hdel("availableCars", carId);
    }
    return { message: "Car deleted successfully", deletedCar };
  }
}

