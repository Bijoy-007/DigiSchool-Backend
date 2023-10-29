import express from "express";
import { body } from "express-validator";

import checkAuth from "../middlewares/checkAuth.js";
import validationErrorHandler from "../middlewares/validationErrorHandler.js";
import StandardController from "../controllers/standard/standard.controller.js";

const router = express.Router();

router.post(
  "/create_standard",
  checkAuth,
  [
    body("schoolId").notEmpty().withMessage("No school ID was passed!"),
    body("standard_name").notEmpty(),
    /**
     ** The *sections* params will be an array with a format [{label: "A", value: "a"}]
     ** hence using the DOT syntax for validation
     */
    body("sections.*.label").notEmpty(),
    body("sections.*.value").notEmpty(),
  ],
  validationErrorHandler,
  StandardController.createStandard
);

export default router;
