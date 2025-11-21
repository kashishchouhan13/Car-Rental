// import { Request, Response } from "express";
// import { RegisterUserCommand } from "../commands/RegisterUserCommand";
// import { RegisterUserHandler } from "../commands/handlers/RegisterUserHandler";

// import { LoginUserQuery } from "../queries/LoginUserQery";
// import { LoginUserHandler } from "../queries/handlers/LoginUserHandler";


// export const register = async (req: Request, res: Response) => {
//   try {
//     const { name, email, password, role } = req.body;
//     const command = new RegisterUserCommand(name, email, password);
//     const handler = new RegisterUserHandler();
//     const user = await handler.execute(command);

//     res.status(201).json({ success: true, user });
//   } catch (err: any) {
//     res.status(400).json({ success: false, message: err.message });
//   }
// };

// export const login = async (req: Request, res: Response) => {
//   try {
//     const { email, password } = req.body;
//     const query = new LoginUserQuery(email, password);
//     const handler = new LoginUserHandler();
//     const result = await handler.execute(query);

//     res.status(200).json({ success: true, ...result });
//   } catch (err: any) {
//     res.status(400).json({ success: false, message: err.message });
//   }
// };

import { Request, Response } from "express";
import { RegisterUserCommand } from "../commands/RegisterUserCommand";
import { RegisterUserHandler } from "../commands/handlers/RegisterUserHandler";

import { LoginUserQuery } from "../queries/LoginUserQery";
import { LoginUserHandler } from "../queries/handlers/LoginUserHandler";

import { User } from "../models/User";

// ⭐ ADMIN MIDDLEWARE
import { requireAdmin } from "../middleware/requireAdmin";

// ------------------------
// REGISTER
// ------------------------
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    const command = new RegisterUserCommand(name, email, password);
    const handler = new RegisterUserHandler();
    const user = await handler.execute(command);

    res.status(201).json({ success: true, user });

  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ------------------------
// LOGIN
// ------------------------
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

// ------------------------
// ⭐ ADMIN: GET ALL USERS
// ------------------------
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select("-password");
    res.json({ success: true, users });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ------------------------
// ⭐ ADMIN: UPDATE USER ROLE
// ------------------------
export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;   // correct place
    const { role } = req.body;

    const target = await User.findById(userId);
    if (!target) return res.status(404).json({ message: "User not found" });

    // ❌ SUPER ADMIN can never be modified
    if (target.isSuperAdmin) {
      return res.status(400).json({ message: "Cannot modify Super Admin" });
    }

    // ❌ Prevent removing last admin
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



