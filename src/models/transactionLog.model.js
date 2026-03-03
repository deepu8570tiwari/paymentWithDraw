import { Schema, model } from "mongoose";

const transactionLogSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    walletId: {
      type: Schema.Types.ObjectId,
      required: true,
    },

    type: {
      type: String,
      enum: ["withdrawal", "deposit", "refund"],
      required: true,
    },

    referenceId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    beforeBalance: {
      type: Number,
      required: true,
    },

    afterBalance: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["success", "failed"],
      required: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } } // immutable
);

export default model("TransactionLog", transactionLogSchema);