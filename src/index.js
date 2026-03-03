import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./configs/db.js"
import userRoutes from "./routes/user.routes.js";
import withdrawalRoutes from "./routes/withdrawal.routes.js";
import { processPendingWithdrawals } from "./jobs/withdrawalProcessor.js";
import walletRoutes from "./routes/wallet.routes.js";
import withdrawalDetailsRoutes from "./routes/withdrawalDetails.routes.js";
import walletSummaryRoutes from "./routes/walletSummary.routes.js";

dotenv.config();
const app=express();
app.use(cors());
app.use(express.json());
const port=process.env.NODE_PORT;
app.use("/api/v1", withdrawalRoutes);
app.use("/api/v1", userRoutes);
app.use("/api/v1", walletRoutes);
app.use("/api/v1", withdrawalDetailsRoutes);
app.use("/api/v1", walletSummaryRoutes);
app.listen(port,()=>{
    console.log(`server is running on ${port}`);
    connectDB();
})
setInterval(async () => {
  console.log("Running withdrawal processor...");
  await processPendingWithdrawals();
}, 5000);