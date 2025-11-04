export class CreateBookingCommand {
  constructor(
    public readonly userId: string,
    public readonly carId: string,
    public readonly startDate: string,
    public readonly endDate: string,
    public readonly amount: number,
  ) {}
}
