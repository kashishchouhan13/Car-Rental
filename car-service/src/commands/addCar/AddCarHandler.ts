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
      name: command.name,
      model: command.model,
      pricePerDay: command.pricePerDay,
      imageUrl: command.imageUrl
    });

    await car.save();

    const event = new CarCreatedEvent(
      car._id.toString(),
      car.name,
      car.model,
      car.pricePerDay,
      car.available,
      car.imageUrl
    );
    await publishEvent("car_exchange", "car.created", event);

    return car;
  }
}


