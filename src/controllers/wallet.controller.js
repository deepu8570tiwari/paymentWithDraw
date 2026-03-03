import Wallet from "../models/wallet.model.js";
import User from "../models/user.model.js";

export const getWalletBalanceController = async (req, res) => {
  try {
    const { userId } = req.params;

    //  Validate user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    //  Fetch wallet
    const wallet = await Wallet.findOne({ userId });

    if (!wallet) {
      return res.status(404).json({
        message: "Wallet not found"
      });
    }

    return res.status(200).json({
      userId: wallet.userId,
      balance: wallet.balance, 
      currency: wallet.currency
    });

  } catch (error) {
    return res.status(400).json({
      message: error.message
    });
  }
};