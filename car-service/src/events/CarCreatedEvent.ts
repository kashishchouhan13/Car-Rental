export class CarCreatedEvent {
  constructor(
    public _id: string,
    public name: string,
    public model: string,
    public pricePerDay: number,
    public available: boolean,
    public imageUrl :string[]
  ) {}
}
