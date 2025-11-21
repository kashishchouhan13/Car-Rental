import { RegisterUserCommand } from "../RegisterUserCommand";
import { User } from "../../models/User";
import bcrypt from "bcryptjs";

export class RegisterUserHandler {
  async execute(command: RegisterUserCommand) {
    const { name, email, password  } = command;

    const exists = await User.findOne({ email });
    if (exists) throw new Error("Email already registered");

    const hashed = await bcrypt.hash(password, 10);
    const isSuperAdmin = email === process.env.SUPER_ADMIN_EMAIL;

    const user = await User.create({ name, email, password: hashed,  role: isSuperAdmin ? "admin" : "user",
      isSuperAdmin: isSuperAdmin,});
    return user;
  }
}
