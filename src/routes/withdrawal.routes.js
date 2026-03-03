import express from "express";
import { body } from "express-validator";
import { withdrawController } from "../controllers/withdrawal.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post(
  "/withdraw",authMiddleware,
  [
    body("amount")
      .isInt({ min: 1 })
      .withMessage("Amount must be a positive integer"),

    body("destination")
      .notEmpty()
      .withMessage("Destination is required")
  ],
  withdrawController
);

export default router;