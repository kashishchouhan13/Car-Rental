import { Car } from "../../models/car";
import { GetAllCarsQuery } from "./GetAllCarsQuery";

export class GetAllCarsHandler {
  async execute(query: GetAllCarsQuery) {
    const cars = await Car.find();
    return cars;
  }
}
