import express from "express";
import { body } from "express-validator";

import AuthController from "../controllers/auth/auth.controller.js";
import validationErrorHandler from "../middlewares/validationErrorHandler.js";

const router = express.Router();

const authController = new AuthController();

router.post(
  "/verifySchool",
  [
    body("token").notEmpty(),
    body("verifyConfirmation").notEmpty(),
  ],
  authController.verifySchool
);

router.post(
  "/login",
  [body("email").notEmpty().isEmail(), body("password").notEmpty()],
  validationErrorHandler,
  authController.login
);

router.post(
  "/refresh_access_token",
  [body("refreshToken").notEmpty().withMessage("No refresh token attached!")],
  validationErrorHandler,
  authController.refreshAccessToken
);

router.post(
  "/delete_refresh_token",
  [body("refreshToken").notEmpty().withMessage("No refresh token attached!")],
  validationErrorHandler,
  authController.deleteRefreshToken
);

export default router;
