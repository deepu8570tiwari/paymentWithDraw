import express from "express";
import { getWithdrawalDetailsController } from "../controllers/withdrawalDetails.controller.js";

const router = express.Router();

router.get("/withdrawals/:withdrawalId", getWithdrawalDetailsController);

export default router;