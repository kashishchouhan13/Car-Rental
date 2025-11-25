import { Request, Response } from "express";
import { RegisterUserCommand } from "../commands/RegisterUserCommand";
import { RegisterUserHandler } from "../commands/handlers/RegisterUserHandler";

import { LoginUserQuery } from "../queries/LoginUserQery";
import { LoginUserHandler } from "../queries/handlers/LoginUserHandler";

import { User } from "../models/User";
import jwt from "jsonwebtoken";
import { redisClient } from "../config/redis";

// REGISTER
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const command = new RegisterUserCommand(name, email, password);
    const handler = new RegisterUserHandler();
    const user = await handler.execute(command);

    res.status(201).json({ success: true, user });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// LOGIN
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const query = new LoginUserQuery(email, password);
    const handler = new LoginUserHandler();
    const { user, token } = await handler.execute(query);

    // Store only role in Redis
    await redisClient.set(
      `user:${user._id}`,
      JSON.stringify({ role: user.role }),
      "EX",
      3600
    );

    return res.status(200).json({
      success: true,
      user,
      token
    });

  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// GET ALL USERS (ADMIN)
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select("-password");
    res.json({ success: true, users });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getUserById = async(req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select("name email");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, user });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// UPDATE USER ROLE (ADMIN)
export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const { role } = req.body;

    const target = await User.findById(userId);
    if (!target) return res.status(404).json({ message: "User not found" });

    if (target.isSuperAdmin) {
      return res.status(400).json({ message: "Cannot modify Super Admin" });
    }

    if (role !== "admin") {
      const adminCount = await User.countDocuments({ role: "admin" });
      if (adminCount <= 1) {
        return res.status(400).json({ message: "Cannot remove last admin" });
      }
    }

    target.role = role;
    await target.save();

    res.json({ success: true, message: "Role updated", user: target });

  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// VERIFY TOKEN
export const verifyToken = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ valid: false });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as { id: string };

    const redisData = await redisClient.get(`user:${decoded.id}`);
    if (!redisData) return res.status(401).json({ valid: false });

    const session = JSON.parse(redisData);

    return res.json({
      valid: true,
      user: { id: decoded.id, role: session.role }
    });

  } catch {
    return res.status(401).json({ valid: false });
  }
};

// LOGOUT
export const logoutUser = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.json({ success: true });

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as { id: string };

    // Delete Redis session
    await redisClient.del(`user:${decoded.id}`);

    return res.json({ success: true });
  } catch {
    return res.json({ success: false });
  }
};
