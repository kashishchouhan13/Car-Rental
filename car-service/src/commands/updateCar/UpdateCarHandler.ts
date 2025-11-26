import { UpdateCarCommand } from "./UpdateCarCommand";
import { Car  } from "../../models/car";
import { publishEvent } from "../../rabbitmq/producer";

export class UpdateCarHandler {
  async execute(command: UpdateCarCommand) {
    const car = await Car.findById(command._id) as  any || null;
    if (!car) throw new Error("Car not found");

    if (command.model !== undefined) car.model = command.model;
    if (command.name !== undefined) car.name = command.name;
    if (command.pricePerDay !== undefined) car.pricePerDay = command.pricePerDay;
    if (command.available !== undefined) car.available = command.available;
    if (command.imageUrl !== undefined) car.imageUrl = command.imageUrl;

    await car.save();

    // Publish event to RabbitMQ
    await publishEvent("car_exchange", "car.updated", {
      _id: car._id,
      model: car.model,
      name: car.name,
      pricePerDay: car.pricePerDay,
      available: car.available,
      imageUrl:car.imageUrl
    });

    return car;
  }
}
