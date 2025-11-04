"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const RegisterUserCommand_1 = require("../commands/RegisterUserCommand");
const RegisterUserHandler_1 = require("../commands/handlers/RegisterUserHandler");
const LoginUserQery_1 = require("../queries/LoginUserQery");
const LoginUserHandler_1 = require("../queries/handlers/LoginUserHandler");
const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const command = new RegisterUserCommand_1.RegisterUserCommand(name, email, password, role);
        const handler = new RegisterUserHandler_1.RegisterUserHandler();
        const user = await handler.execute(command);
        res.status(201).json({ success: true, user });
    }
    catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
exports.register = register;
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
