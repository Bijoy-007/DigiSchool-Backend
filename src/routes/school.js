import express from "express";
import { body } from "express-validator";
import checkAuth from "../middlewares/checkAuth.js";

import SchoolController from "../controllers/school/school.controller.js";
import validationErrorHandler from "../middlewares/validationErrorHandler.js";

const router = express.Router();

const schoolController = new SchoolController();

router.post(
  "/create_school",
  [
    body("email").notEmpty().isEmail(),
    body("password").notEmpty().isStrongPassword().withMessage("Password is too weak. Please use a strong password!"),
    body("confirm_Password").notEmpty().isStrongPassword(),
    body("schoolName").notEmpty(),
  ],
  validationErrorHandler,
  schoolController.createNewSchool
);

router.post(
  "/get_school",
  [body("email").notEmpty().isEmail()],
  schoolController.getSchool
);

router.post(
  "/update_school",
  [
    body("email").notEmpty().isEmail(),
    body("username").notEmpty(),
    body("schoolName").notEmpty()
  ],
  schoolController.updateSchool
);

router.post(
  "/change_password",
  checkAuth,
  [
    body("schoolId").notEmpty().withMessage("No school ID was passed!"),
    body("old_Password").notEmpty(),
    body("new_Password").notEmpty().isStrongPassword(),
    body("confirm_Password").notEmpty().isStrongPassword(),
  ],
  schoolController.changePassword
);

router.post(
  "/delete_school",
  [body("email").notEmpty().isEmail(), body("password").notEmpty()],
  schoolController.deleteSchool
);

export default router;
