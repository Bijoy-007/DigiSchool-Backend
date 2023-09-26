import { validationResult } from "express-validator";
import SchoolService from "../../services/school.service.js";

class SchoolController {
  constructor() {
  }

  /**
   * Controller to create a new school
   * @param {req.body} contains the following properties 
   * @param {username}
   * @param {password}
   * @param {schoolName}
   * @param {highestGrade}
   * @param {lowestGrade}
   * @param {email}
   */
  async createNewSchool(req, res, next) {
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

      // * Creating a new school with the given payload
      const savedSchoolDetails = await SchoolService.createNewSchool(
        req.body
      );

      res.status(201).json({
        status: "success",
        message: "School created successfully",
        data: {
          username: savedSchoolDetails?.username,
          id: savedSchoolDetails?._id,
          email: savedSchoolDetails?.email,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default SchoolController;
