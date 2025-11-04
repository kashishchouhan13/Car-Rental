export class UpdateCarCommand {
  constructor(
    public id: string,
    public model?: string,
    public brand?: string,
    public pricePerDay?: number,
    public available?: boolean
  ) {}
}
