import { validationResult } from "express-validator";
import SchoolModel from "../../models/school.model.js";
import UpdateSchoolService from "../../services/updateSchool.service.js";


import bcrpt from "bcrypt";

class UpdateSchoolController {
  constructor() {}

  async updateSchoolControllerFunction(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          /**
           * If there is any error then throwing error along with details.
           */
          throw new Error("Field validation failed!", {
            cause: { indicator: "validation", status: 400, details: errors },
          });
        }

    const updatedFieldDetails = await UpdateSchoolService.updateSchoolServiceFunction(req.body, res);
    
    } catch (error) {
        next(error);
    }
  }
}
export default UpdateSchoolController;
