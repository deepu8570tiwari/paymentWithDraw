import express from "express";
import { body } from "express-validator";
import { createUserController } from "../controllers/user.controller.js";

const router = express.Router();

router.post(
  "/users",
  [
    body("email").isEmail().withMessage("Valid email required"),
    body("initialBalance")
      .optional()
      .isInt({ min: 0 })
      .withMessage("Initial balance must be non-negative integer")
  ],
  createUserController
);

export default router;