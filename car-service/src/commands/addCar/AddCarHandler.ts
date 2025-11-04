import { AddCarCommand } from "./AddCarCommand";
import { Car } from "../../models/car";
import { CarCreatedEvent } from "../../events/CarCreatedEvent";
import { publishEvent } from "../../rabbitmq/producer";

 interface User {
  id: string;
  role: string;
}
export class AddCarHandler {
  async execute(command: AddCarCommand, user: User) {
    if (user.role !== "admin") {
      throw new Error("Only admins can add cars");
    }
  
    const car = new Car({
      model: command.model,
      brand: command.brand,
      pricePerDay: command.pricePerDay,
    });

    await car.save();

    const event = new CarCreatedEvent(
      car._id.toString(),
      car.model,
      car.brand,
      car.pricePerDay,
      car.available
    );
    await publishEvent("car_exchange", "car.created", event);

    return car;
  }
}

