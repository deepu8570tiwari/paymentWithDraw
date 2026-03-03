import Withdrawal from "../models/withdrawal.model.js";
import TransactionLog from "../models/transactionLog.model.js";

export const getWithdrawalDetailsController = async (req, res) => {
  try {
    const { withdrawalId } = req.params;

    const withdrawal = await Withdrawal.findById(withdrawalId);
    if (!withdrawal) {
      return res.status(404).json({ message: "Withdrawal not found" });
    }

    const transactionLog = await TransactionLog.findOne({
      referenceId: withdrawal._id
    });

    return res.status(200).json({
      withdrawalId: withdrawal._id,
      status: withdrawal.status,
      amountTransferred: withdrawal.amount,
      destination: withdrawal.destination,
      attempts: withdrawal.attempts,
      failureReason: withdrawal.failureReason || null,
      previousBalance: transactionLog?.beforeBalance || null,
      newBalance: transactionLog?.afterBalance || null,
      processedAt: transactionLog?.createdAt || null,
      createdAt: withdrawal.createdAt
    });

  } catch (error) {
    return res.status(400).json({
      message: error.message
    });
  }
};