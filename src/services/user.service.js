import mongoose from "mongoose";
import User from "../models/user.model.js";
import Wallet from "../models/wallet.model.js";

export const createUserWithWallet = async ({ email, initialBalance = 0 }) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    // Check if user already exists
    const existingUser = await User.findOne({ email }).session(session);
    if (existingUser) {
      throw new Error("User already exists");
    }
    // Create user
    const user = await User.create(
      [
        {
          email,
          status: "active"
        }
      ],
      { session }
    );

    //  Create wallet automatically
    const wallet = await Wallet.create(
      [
        {
          userId: user[0]._id,
          balance: initialBalance, // stored as integer
          currency: "INR"
        }
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();
    return {
      user: user[0],
      wallet: wallet[0]
    };

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};