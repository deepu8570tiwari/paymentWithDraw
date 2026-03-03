import User from "../models/user.model.js";
import Wallet from "../models/wallet.model.js";
import Withdrawal from "../models/withdrawal.model.js";

export const createWithdrawalRequest = async ({
  userId,
  amount,
  destination,
  idempotencyKey
}) => {

  // Idempotency check
  const existing = await Withdrawal.findOne({ idempotencyKey });
  if (existing) return existing;

  //  Validate user
  const user = await User.findById(userId);
  if (!user || user.status !== "active") {
    throw new Error("User not allowed to withdraw");
  }

  // Validate wallet exists
  const wallet = await Wallet.findOne({ userId });
  if (!wallet) {
    throw new Error("Wallet not found");
  }

  //  Create withdrawal as PENDING
  const withdrawal = await Withdrawal.create({
    userId,
    walletId: wallet._id,
    amount,
    destination,
    status: "pending",
    idempotencyKey
  });

  return withdrawal;
};