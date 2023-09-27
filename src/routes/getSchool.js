import express from "express";
import GetSchoolController from "../controllers/school/getSchool.controller.js";





const router = express.Router();


// * *  storing all the functions under the class GetSchoolController
const getSchoolController = new GetSchoolController();


router.get('/get_school', getSchoolController.getSchool);

export default router;