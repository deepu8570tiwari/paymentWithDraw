import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/user.model.js";
import Wallet from "../models/wallet.model.js";

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB connected for seeding...");

    // 🧹 Clear old test data (optional for dev)
    await User.deleteMany();
    await Wallet.deleteMany();

    console.log("Old test data cleared.");

    // 👤 Create Users
    const users = await User.insertMany([
      { email: "deepu1@gmail.com", status: "active" },
      { email: "deepu2@gmail.com", status: "active" },
      { email: "blocked@gmail.com", status: "blocked" }
    ]);

    console.log("Users inserted.");

    const wallets = await Wallet.insertMany([
      {
        userId: users[0]._id,
        balance: 500000,
        currency: "INR"
      },
      {
        userId: users[1]._id,
        balance: 100000,
        currency: "INR"
      },
      {
        userId: users[2]._id,
        balance: 200000,
        currency: "INR"
      }
    ]);

    console.log("Wallets inserted.");

    console.log("Seeding completed successfully.");
    process.exit();
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};
seedDatabase();