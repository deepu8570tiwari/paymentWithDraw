import express from "express";
import { getWalletBalanceController } from "../controllers/wallet.controller.js";

const router = express.Router();

router.get("/wallet/:userId", getWalletBalanceController);

export default router;