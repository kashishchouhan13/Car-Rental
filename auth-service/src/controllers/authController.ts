import { Request, Response } from "express";
import { RegisterUserCommand } from "../commands/RegisterUserCommand";
import { RegisterUserHandler } from "../commands/handlers/RegisterUserHandler";

import { LoginUserQuery } from "../queries/LoginUserQery";
import { LoginUserHandler } from "../queries/handlers/LoginUserHandler";


export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;
    const command = new RegisterUserCommand(name, email, password, role);
    const handler = new RegisterUserHandler();
    const user = await handler.execute(command);

    res.status(201).json({ success: true, user });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const query = new LoginUserQuery(email, password);
    const handler = new LoginUserHandler();
    const result = await handler.execute(query);

    res.status(200).json({ success: true, ...result });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};




