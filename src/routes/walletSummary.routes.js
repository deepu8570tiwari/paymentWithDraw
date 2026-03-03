import express from "express";
import { getWalletSummaryController } from "../controllers/walletSummary.controller.js";

const router = express.Router();

router.get("/wallet/:userId/summary", getWalletSummaryController);

export default router;