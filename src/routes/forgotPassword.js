import express from "express";
import { body } from "express-validator";

import ForgotPasswordController from "../controllers/forgotPassword/forgotPassword.controller.js"; 

const router = express.Router();

const forgotPasswordController = new ForgotPasswordController();

router.post(
    "/sendMail",
    [
      body("email").notEmpty().isEmail(),
    ],
    forgotPasswordController.forgotPassword
  );

  router.post(
    "/resetPassword",
    [
      body("id").notEmpty(),
      body("token").notEmpty(),
      body("newPassword").notEmpty().isStrongPassword(),
      body("confirmPassword").notEmpty().isStrongPassword(),
    ],
    forgotPasswordController.resetPassword
  );

  export default router;