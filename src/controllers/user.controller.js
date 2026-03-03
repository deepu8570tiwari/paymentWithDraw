import { validationResult } from "express-validator";
import { createUserWithWallet } from "../services/user.service.js";

export const createUserController = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, initialBalance } = req.body;
    const result = await createUserWithWallet({
      email,
      initialBalance: parseInt(initialBalance) || 0
    });
    return res.status(201).json({
      message: "User created successfully",
      data: result
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message
    });
  }
};