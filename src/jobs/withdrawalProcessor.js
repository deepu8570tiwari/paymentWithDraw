import mongoose from "mongoose";
import Withdrawal from "../models/withdrawal.model.js";
import Wallet from "../models/wallet.model.js";
import TransactionLog from "../models/transactionLog.model.js";

const MAX_RETRIES = 3;

export const processPendingWithdrawals = async () => {

  const pendingList = await Withdrawal.find({
    status: "pending",
    attempts: { $lt: MAX_RETRIES }
  })
    .sort({ createdAt: 1 })
    .limit(5);

  for (const withdrawal of pendingList) {

    const session = await mongoose.startSession();
    let retries = 3;

    while (retries > 0) {
      try {
        session.startTransaction();

        const updated = await Withdrawal.findOneAndUpdate(
          { _id: withdrawal._id, status: "pending" },
          { $set: { status: "processing" }, $inc: { attempts: 1 } },
          { new: true, session }
        );

        if (!updated) {
          await session.abortTransaction();
          break;
        }

        const wallet = await Wallet.findById(withdrawal.walletId).session(session);

        const updatedWallet = await Wallet.findOneAndUpdate(
          {
            _id: wallet._id,
            balance: { $gte: withdrawal.amount }
          },
          {
            $inc: { balance: -withdrawal.amount }
          },
          { new: true, session }
        );

        if (!updatedWallet) {
          throw new Error("Insufficient balance");
        }

        await TransactionLog.create([{
          userId: withdrawal.userId,
          walletId: wallet._id,
          type: "withdrawal",
          referenceId: withdrawal._id,
          amount: withdrawal.amount,
          beforeBalance: wallet.balance,
          afterBalance: updatedWallet.balance,
          status: "success"
        }], { session });

        await Withdrawal.updateOne(
          { _id: withdrawal._id },
          { $set: { status: "success" } },
          { session }
        );

        await session.commitTransaction();
        break;

      } catch (error) {

        await session.abortTransaction();

        if (error.message.includes("Write conflict")) {
          retries--;
          continue;
        }

        await Withdrawal.updateOne(
          { _id: withdrawal._id },
          {
            $set: {
              status: "failed",
              failureReason: error.message
            }
          }
        );
        break;
      }
    }
    session.endSession(); 
  }
};