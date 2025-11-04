"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterUserCommand = void 0;
class RegisterUserCommand {
    constructor(name, email, password, role = "user") {
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
    }
}
exports.RegisterUserCommand = RegisterUserCommand;
