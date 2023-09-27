import express from 'express';
import { body } from "express-validator";
import UpdateSchoolController from "../controllers/school/updateSchool.controller.js"



const router = express.Router();

const updateSchoolController = new UpdateSchoolController();

router.post("/update_school",[
    body("email").notEmpty().isEmail(),
    body("password").notEmpty(),
], updateSchoolController.updateSchoolControllerFunction);

export default router;