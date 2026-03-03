import Wallet from "../models/wallet.model.js";
import TransactionLog from "../models/transactionLog.model.js";
import User from "../models/user.model.js";

export const getWalletSummaryController = async (req, res) => {
  try {
    const { userId } = req.params;

    // 1️⃣ Validate user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2️⃣ Get current wallet balance
    const wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    // 3️⃣ Get last 10 transactions (latest first)
    const transactions = await TransactionLog.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10);

    const formattedTransactions = transactions.map(tx => ({
      type: tx.type,
      amount: tx.amount,
      previousBalance: tx.beforeBalance,
      newBalance: tx.afterBalance,
      status: tx.status,
      processedAt: tx.createdAt
    }));

    return res.status(200).json({
      currentBalance: wallet.balance,
      currency: wallet.currency,
      recentTransactions: formattedTransactions
    });

  } catch (error) {
    return res.status(400).json({
      message: error.message
    });
  }
};