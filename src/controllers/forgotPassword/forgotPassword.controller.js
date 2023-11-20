import { validationResult } from "express-validator";
import ForgotPasswordService from "../../services/forgotPassword.service.js";

class ForgotPasswordController {
  constructor() {}

  async forgotPassword(req, res, next) {

    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        /**
         * If there is any error then throwing error along with details.
         */
        throw new Error("Field validation failed!", {
          cause: { indicator: "validation", status: 400, details: errors },
        });
      }

      const savedMailDetails = await ForgotPasswordService.sendPasswordResetEmail(req.body);

      res.status(201).json({
        status: "success",
        message: "Mail Sent successfully",
        data: {
          message: savedMailDetails
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req, res, next) {

    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new Error("Field validation failed!", {
          cause: { indicator: "validation", status: 400, details: errors },
        });
      }

      const resetPasswordDetails = await ForgotPasswordService.resetPassword(req.body);

      res.status(201).json({
        status: "success",
        message: "Password updated successfully",
        data: {
          message: resetPasswordDetails
        },
      });
    } catch (error) {
      next(error)
    }
  }
}

export default ForgotPasswordController;