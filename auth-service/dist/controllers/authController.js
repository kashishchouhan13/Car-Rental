"use strict";
// import { Request, Response } from "express";
// import { RegisterUserCommand } from "../commands/RegisterUserCommand";
// import { RegisterUserHandler } from "../commands/handlers/RegisterUserHandler";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserRole = exports.getAllUsers = exports.login = exports.register = void 0;
const RegisterUserCommand_1 = require("../commands/RegisterUserCommand");
const RegisterUserHandler_1 = require("../commands/handlers/RegisterUserHandler");
const LoginUserQery_1 = require("../queries/LoginUserQery");
const LoginUserHandler_1 = require("../queries/handlers/LoginUserHandler");
const User_1 = require("../models/User");
// ------------------------
// REGISTER
// ------------------------
const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
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
        const result = await handler.execute(query);
        res.status(200).json({ success: true, ...result });
    }
    catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
exports.login = login;
// ------------------------
// ⭐ ADMIN: GET ALL USERS
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
// ------------------------
// ⭐ ADMIN: UPDATE USER ROLE
// ------------------------
const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        const { id } = req.params;
        if (!["admin", "user"].includes(role)) {
            return res.status(400).json({ success: false, message: "Invalid role" });
        }
        const updated = await User_1.User.findByIdAndUpdate(id, { role }, { new: true });
        res.json({ success: true, user: updated });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
exports.updateUserRole = updateUserRole;
