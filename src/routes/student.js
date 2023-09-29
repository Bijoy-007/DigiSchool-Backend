import express from "express";
import { body } from "express-validator";

import StudentController from "../controllers/student/student.controller.js";

const router = express.Router();

const studentController = new StudentController();

router.post(
  "/create_student",
  [
    body("name").notEmpty(),
    body("parentName").notEmpty(),
    body("gender").notEmpty(),
    body("standard")
      .notEmpty()
      .custom((value) => {
        /**
         * As the value will be passed as a string that's why first
         * converting that to number then doing the validation
         **/
        return +value > 0 && +value < 13;
      }),
    body("roll")
      .notEmpty()
      .custom((value) => {
        return +value > 0 && +value < 100;
      }),
    body("mobileNo").notEmpty().isMobilePhone(),
    body("address").notEmpty(),
    body("bloodGroup").notEmpty(),
    body("section").notEmpty(),
    body("email").notEmpty().isEmail(),
  ],
  studentController.createStudent
);

router.get("/get_students", studentController.getStudents);

router.post(
  "/get_student",
  [body("name").notEmpty()],
  studentController.getStudent
);

router.post(
  "/update_student",
  [
    body("standard")
      .notEmpty()
      .custom((value) => {
        return +value > 0 && +value < 13;
      }),
    body("roll").notEmpty(),
  ],
  studentController.updateStudent
);

router.post(
  "/delete_student",
  [
    body("name").notEmpty(),
    body("standard")
      .notEmpty()
      .custom((value) => {
        return +value > 0 && +value < 13;
      }),
    body("section").notEmpty().isIn(["a", "b", "c", "d", "A", "B", "C", "D"]),
    body("roll").notEmpty(),
  ],
  studentController.deleteStudent
);

export default router;
