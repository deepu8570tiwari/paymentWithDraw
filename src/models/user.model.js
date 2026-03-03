import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["active", "blocked", "suspended"],
      default: "active",
      index: true,
    },
  },
  { timestamps: true }
);

export default model("User", userSchema);