export class AddCarCommand {
  constructor(
    public name: string,
    public model: string,
    public pricePerDay: number,
    public imageUrl: string[] 
  ) {}
}
