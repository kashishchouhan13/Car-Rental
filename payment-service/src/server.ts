import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { startBookingConsumer } from "./consumers/bookingConsumer";

const PORT = process.env.PORT || 5002;

app.listen(PORT, async () => {
  console.log(` Payment Service running on port ${PORT}`);
  await startBookingConsumer();
});
