import express from "express";
import { body } from "express-validator";

import StudentController from "../controllers/student/student.controller.js";
import checkAuth from "../middlewares/checkAuth.js";

const router = express.Router();

const studentController = new StudentController();

router.post(
  "/create_student",
  checkAuth,
  [
    body("name").notEmpty(),
    body("parentName").notEmpty(),
    body("gender").notEmpty(),
    body("standard").notEmpty(),
    body("roll").notEmpty(),
    body("mobileNo").notEmpty().isMobilePhone(),
    body("address").notEmpty(),
    body("bloodGroup").notEmpty(),
    body("section").notEmpty(),
  ],
  studentController.createStudent
);

// * To get all the students of every school
router.get("/get_students", studentController.getStudents);

// * To get all the students of a particular school
router.post(
  "/get_students_by_school",
  checkAuth,
  [
    body("schoolId").notEmpty().withMessage("No school ID was passed!"),
    body("page")
      .notEmpty()
      .custom((value) => {
        /**
         * As the value will be passed as a string that's why first
         * converting that to number then doing the validation
         **/
        return +value > 0;
      }),
    body("size")
      .notEmpty()
      .custom((value) => {
        return +value > 0;
      }),
  ],
  studentController.getStudentsBySchool
);

router.post(
  "/get_student",
  [
    body("standard")
      .notEmpty()
      .custom((value) => {
        return +value > 0 && +value < 13;
      }),
    body("section").notEmpty(),
    body("roll").notEmpty(),
    body("email").notEmpty(),
  ],
  studentController.getStudent
);

router.post(
  "/update_student",
  checkAuth,
  [
    body("schoolId").notEmpty().withMessage("No school ID was passed!"),
    body("standard").notEmpty(),
    body("section").notEmpty(),
    body("roll").notEmpty(),
    body("parentNameToUpdate").notEmpty(),
    body("standardToUpdate").notEmpty(),
    body("sectionToUpdate").notEmpty(),
    body("rollToUpdate").notEmpty(),
    body("mobileNoToUpdate").notEmpty(),
    body("addressToUpdate").notEmpty(),
  ],
  studentController.updateStudent
);

router.post(
  "/delete_student",
  [
    body("standard")
      .notEmpty()
      .custom((value) => {
        return +value > 0 && +value < 13;
      }),
    body("section").notEmpty(),
    body("roll").notEmpty(),
    body("email").notEmpty().isEmail(),
  ],
  studentController.deleteStudent
);

export default router;
