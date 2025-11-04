import { LoginUserQuery } from "../LoginUserQery";
import { User } from "../../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { redisClient } from "../../config/redis";

export class LoginUserHandler {
  async execute(query: LoginUserQuery) {
    const { email, password } = query;

    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("Invalid credentials");

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: "1h" });

await redisClient.set(
  `user:${user._id}`,
  JSON.stringify({ token, role: user.role }),
  "EX",
  3600
);

    return { user, token };
  }
}




