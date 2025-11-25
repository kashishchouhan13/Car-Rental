"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutUser = exports.verifyToken = exports.updateUserRole = exports.getUserById = exports.getAllUsers = exports.login = exports.register = void 0;
const RegisterUserCommand_1 = require("../commands/RegisterUserCommand");
const RegisterUserHandler_1 = require("../commands/handlers/RegisterUserHandler");
const LoginUserQery_1 = require("../queries/LoginUserQery");
const LoginUserHandler_1 = require("../queries/handlers/LoginUserHandler");
const User_1 = require("../models/User");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const redis_1 = require("../config/redis");
// ------------------------
// REGISTER
// ------------------------
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const command = new RegisterUserCommand_1.RegisterUserCommand(name, email, password);
        const handler = new RegisterUserHandler_1.RegisterUserHandler();
        const user = await handler.execute(command);
        res.status(201).json({ success: true, user });
    }
    catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
exports.register = register;
// ------------------------
// LOGIN
// ------------------------
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const query = new LoginUserQery_1.LoginUserQuery(email, password);
        const handler = new LoginUserHandler_1.LoginUserHandler();
        const { user, token } = await handler.execute(query);
        // Store only role in Redis
        await redis_1.redisClient.set(`user:${user._id}`, JSON.stringify({ role: user.role }), "EX", 3600);
        return res.status(200).json({
            success: true,
            user,
            token
        });
    }
    catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
exports.login = login;
// ------------------------
// GET ALL USERS (ADMIN)
// ------------------------
const getAllUsers = async (req, res) => {
    try {
        const users = await User_1.User.find().select("-password");
        res.json({ success: true, users });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
exports.getAllUsers = getAllUsers;
const getUserById = async (req, res) => {
    try {
        const user = await User_1.User.findById(req.params.id).select("name email");
        if (!user)
            return res.status(404).json({ success: false, message: "User not found" });
        res.json({ success: true, user });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
exports.getUserById = getUserById;
// ------------------------
// UPDATE USER ROLE (ADMIN)
// ------------------------
const updateUserRole = async (req, res) => {
    try {
        const userId = req.params.id;
        const { role } = req.body;
        const target = await User_1.User.findById(userId);
        if (!target)
            return res.status(404).json({ message: "User not found" });
        if (target.isSuperAdmin) {
            return res.status(400).json({ message: "Cannot modify Super Admin" });
        }
        if (role !== "admin") {
            const adminCount = await User_1.User.countDocuments({ role: "admin" });
            if (adminCount <= 1) {
                return res.status(400).json({ message: "Cannot remove last admin" });
            }
        }
        target.role = role;
        await target.save();
        res.json({ success: true, message: "Role updated", user: target });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.updateUserRole = updateUserRole;
// ------------------------
// VERIFY TOKEN
// ------------------------
const verifyToken = async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader)
        return res.status(401).json({ valid: false });
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "secret");
        const redisData = await redis_1.redisClient.get(`user:${decoded.id}`);
        if (!redisData)
            return res.status(401).json({ valid: false });
        const session = JSON.parse(redisData);
        return res.json({
            valid: true,
            user: { id: decoded.id, role: session.role }
        });
    }
    catch {
        return res.status(401).json({ valid: false });
    }
};
exports.verifyToken = verifyToken;
// ------------------------
// LOGOUT
// ------------------------
const logoutUser = async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader)
        return res.json({ success: true });
    try {
        const token = authHeader.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "secret");
        // Delete Redis session
        await redis_1.redisClient.del(`user:${decoded.id}`);
        return res.json({ success: true });
    }
    catch {
        return res.json({ success: false });
    }
};
exports.logoutUser = logoutUser;
