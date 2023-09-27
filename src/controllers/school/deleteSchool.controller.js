import { validationResult } from "express-validator";
import DeleteSchoolService from "../../services/deleteSchool.service.js";

const deleteSchoolService = new DeleteSchoolService();

class DeleteSchoolController {
  constructor() {}

  async deleteSchool(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        /**
         * If there is any error then throwing error along with details.
         */
        throw new Error("Field validation failed!", {
          cause: { indicator: "validation", status: 400, details: errors },
        });
      } else {
        const deleteSchoolDetails =
          await deleteSchoolService.deleteSchoolServiceFunction(req.body, res);
      }
    } catch (error) {
      next(error);
    }
  }
}
export default DeleteSchoolController;
