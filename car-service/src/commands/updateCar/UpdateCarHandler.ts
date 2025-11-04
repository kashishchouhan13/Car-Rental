import { UpdateCarCommand } from "./UpdateCarCommand";
import { Car  } from "../../models/car";
import { publishEvent } from "../../rabbitmq/producer";

export class UpdateCarHandler {
  async execute(command: UpdateCarCommand) {
    const car = await Car.findById(command.id) as  any || null;
    if (!car) throw new Error("Car not found");

    if (command.model !== undefined) car.model = command.model;
    if (command.brand !== undefined) car.brand = command.brand;
    if (command.pricePerDay !== undefined) car.pricePerDay = command.pricePerDay;
    if (command.available !== undefined) car.available = command.available;

    await car.save();

    // Publish event to RabbitMQ
    await publishEvent("car_exchange", "car.updated", {
      id: car._id,
      model: car.model,
      brand: car.brand,
      pricePerDay: car.pricePerDay,
      available: car.available,
    });

    return car;
  }
}
