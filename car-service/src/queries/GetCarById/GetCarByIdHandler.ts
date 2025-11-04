import { Car } from "../../models/car";
import { GetCarByIdQuery } from "./GetCarByIdQuery";

export class GetCarByIdHandler {
  async execute(query: GetCarByIdQuery) {
    const car = await Car.findById(query.id) as any | null;
    if (!car) throw new Error("Car not found");

    return car;
  }
}
