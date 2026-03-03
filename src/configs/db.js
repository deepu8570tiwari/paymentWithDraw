import mongoose from "mongoose";

export const connectDB = async () => {
  if (!process.env.MONGO_URL) {
    console.error("MONGO_URL is not defined in .env");
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGO_URL);
  console.log("MongoDB connected");
};