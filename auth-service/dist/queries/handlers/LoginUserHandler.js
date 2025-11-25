"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUserHandler = void 0;
const User_1 = require("../../models/User");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const redis_1 = require("../../config/redis");
class LoginUserHandler {
    async execute(query) {
        const { email, password } = query;
        const user = await User_1.User.findOne({ email });
        if (!user)
            throw new Error("User not found");
        const match = await bcryptjs_1.default.compare(password, user.password);
        if (!match)
            throw new Error("Invalid credentials");
        const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        await redis_1.redisClient.set(`user:${user._id}`, JSON.stringify({ role: user.role }), "EX", 3600);
        return { user, token };
    }
}
exports.LoginUserHandler = LoginUserHandler;
