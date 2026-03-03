import { createWithdrawalRequest } from "../services/withdrawal.service.js";
import { validationResult } from "express-validator";
import { v4 as uuidv4 } from "uuid";

export const withdrawController = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { amount, destination } = req.body;
    const userId = req.user.userId;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    let idempotencyKey = req.headers["idempotency-key"];
    if (!idempotencyKey) {
      idempotencyKey = uuidv4();
    }
    const withdrawal = await createWithdrawalRequest({
      userId,
      amount: parseInt(amount),
      destination,
      idempotencyKey
    });

    return res.status(201).json({
      message: "Withdrawal request created",
      data: withdrawal
    });

  } catch (error) {
    return res.status(400).json({
      message: error.message
    });
  }
};