export class AddCarCommand {
  constructor(
    public model: string,
    public brand: string,
    public pricePerDay: number
  ) {}
}
