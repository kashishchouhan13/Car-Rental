export class CarCreatedEvent {
  constructor(
    public id: string,
    public name: string,
    public model: string,
    public pricePerDay: number,
    public available: boolean,
    public imageUrl :string[]
  ) {}
}
