"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterUserHandler = void 0;
const User_1 = require("../../models/User");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class RegisterUserHandler {
    async execute(command) {
        const { name, email, password } = command;
        const exists = await User_1.User.findOne({ email });
        if (exists)
            throw new Error("Email already registered");
        const hashed = await bcryptjs_1.default.hash(password, 10);
        const user = await User_1.User.create({ name, email, password: hashed, role: "user" });
        return user;
    }
}
exports.RegisterUserHandler = RegisterUserHandler;
