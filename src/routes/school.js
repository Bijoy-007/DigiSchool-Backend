import express from "express";

import SchoolController from "../controllers/school/school.controller.js";

const router = express.Router();

const schoolController = new SchoolController();

router.post("/create_school", schoolController.createNewSchool);

export default router;