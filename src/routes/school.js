import express from "express";
import { body } from "express-validator";

import SchoolController from "../controllers/school/school.controller.js";

const router = express.Router();

const schoolController = new SchoolController();

router.post(
  "/create_school",
  [
    body("email").notEmpty().isEmail(),
    body("password").notEmpty().isStrongPassword(),
    body("schoolName").notEmpty(),
  ],
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
  "/delete_school",
  [body("email").notEmpty().isEmail(), body("password").notEmpty()],
  schoolController.deleteSchool
);

export default router;
