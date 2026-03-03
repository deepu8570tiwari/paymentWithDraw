import { Schema, model } from "mongoose";

const withdrawalSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    walletId: {
      type: Schema.Types.ObjectId,
      ref: "Wallet",
      required: true,
      index: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 1,
    },

    destination: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["pending", "processing", "success", "failed"],
      default: "pending",
      index: true,
    },

    attempts: {
      type: Number,
      default: 0,
      min: 0
    },

    idempotencyKey: {
      type: String,
      required: true,
      unique: true,
      immutable: true 
    },

    failureReason: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    strict: true
  }
);


// Fast lookup for background worker
withdrawalSchema.index({ status: 1, attempts: 1 });

// Fast lookup for user history
withdrawalSchema.index({ userId: 1, createdAt: -1 });


withdrawalSchema.pre("findOneAndUpdate", async function () {
  const update = this.getUpdate();

  if (update?.$set?.status) {
    const current = await this.model.findOne(this.getQuery());

    if (!current) return;

    const allowedTransitions = {
      pending: ["processing"],
      processing: ["success", "failed"],
      success: [],
      failed: []
    };

    const nextStatus = update.$set.status;

    if (!allowedTransitions[current.status].includes(nextStatus)) {
      throw new Error(
        `Invalid state transition from ${current.status} to ${nextStatus}`
      );
    }
  }
});

export default model("Withdrawal", withdrawalSchema);