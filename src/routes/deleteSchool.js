import  express  from "express";
import { body } from "express-validator";
import DeleteSchoolController from "../controllers/school/deleteSchool.controller.js"



const router = express.Router();

const deleteSchoolController = new DeleteSchoolController();

router.get("/delete_school",[
    body("email").notEmpty().isEmail(),
    body("password").notEmpty(),
    body("username").notEmpty(),
    body("schoolName").notEmpty(),
], deleteSchoolController.deleteSchool);

export default router;