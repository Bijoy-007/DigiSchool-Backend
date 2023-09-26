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
    body("username").notEmpty(),
    body("schoolName").notEmpty(),
    body("lowestGrade")
      .notEmpty()
      .custom((value) => {
        /**
         * As the value will be passed as a string that's why first
         * converting that to number then doing the validation
         **/
        return +value > 0 && +value < 13;
      }),
    body("highestGrade")
      .notEmpty()
      .custom((value, { req }) => {
        /**
         * As the value will be passed as a string that's why first
         * converting that to number then doing the validation and also
         * the highest should be gretaer or equals to lowest
         **/
        return +value > 0 && +value < 13 && +value >= req.body.lowestGrade;
      }),
  ],
  schoolController.createNewSchool
);

export default router;
