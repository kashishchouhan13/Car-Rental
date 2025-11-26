export class UpdateCarCommand {
  constructor(
    public _id: string,
    public model?: string,
    public name?: string,
    public pricePerDay?: number,
    public available?: boolean,
    public imageUrl?:string[]
  ) {}
}
