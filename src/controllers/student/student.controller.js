import { validationResult } from "express-validator";
import StudentService from "../../services/student.service.js";

class StudentController {
  constructor() {}

  /**
   * Controller to create a new student
   * @param {req.body} contains the following properties
   * @param {name}
   * @param {parentName}
   * @param {standard}
   * @param {section}
   * @param {roll}
   * @param {mobileNo}
   * @param {address}
   * @param {bloodGroup}
   * @param {schoolId}
   */

  async createStudent(req, res, next) {
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

      // * If no error found then creating a new student
      const newStudent = await StudentService.createStudent(req.body);

      res.status(201).json({
        status: "success",
        message: "Student created successfully",
        data: newStudent,
      });
    } catch (error) {
      next(error);
    }
  }

  async getStudents(req, res, next) {
    try {
      // * Storing the available students from DB
      const foundStudents = await StudentService.getStudents();

      res.status(200).json({
        status: "success",
        message: "Students found",
        data: foundStudents,
      });
    } catch (error) {
      next(error);
    }
  }

  async getStudentsBySchool(req, res, next) {
    try {
      const errors = validationResult(req, res);      
      if (!errors.isEmpty()) {
        /**
         * If there is any error then throwing error along with details.
         */
        throw new Error("Field validation failed!", {
          cause: { indicator: "validation", status: 400, details: errors },
        });
      }
      // * Storing the available students from DB
      const foundStudents = await StudentService.getStudentsBySchool(req.body);

      res.status(200).json({
        status: "success",
        message: "Students found",
        data: foundStudents,
      });
    } catch (error) {
      next(error);
    }
  }

  async getStudent(req, res, next) {
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

      const foundStudent = await StudentService.getStudent(req.body);

      res.status(200).json({
        status: "success",
        message: "Student found successfully",
        data: foundStudent,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateStudent(req, res, next) {
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

      const foundStudent = await StudentService.updateStudent(req.body);

      res.status(201).json({
        status: "success",
        message: "Student updated successfully",
        data: {
          name: foundStudent?.name,
          parentName: foundStudent?.parentName,
          standard: foundStudent?.standard,
          section: foundStudent?.section,
          roll: foundStudent?.roll,
          mobileNo: foundStudent?.mobileNo,
          address: foundStudent?.address,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteStudent(req, res, next) {
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
        const deleteStudentDetails = await StudentService.deleteStudent(
          req.body
        );
        res.status(201).json({
          status: "success",
          message: "Student deleted successfully",
          data: {
            name: deleteStudentDetails?.name,
            class: deleteStudentDetails?.standard,
            id: deleteStudentDetails?._id,
            isDeleted: deleteStudentDetails?.isDeleted,
          },
        });
      }
    } catch (error) {
      next(error);
    }
  }

  async downloadStudentData(req, res, next) {
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
        const csvData = await StudentService.getStudentsDetailsCSV(req.body);

        /**
         * These headers are required to indicate the frontend that the API will return Blob data
         */
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=student_data.csv');

        res.status(200).send(csvData)
      }
    } catch (error) {
      next(error);
    }
  }
}
export default StudentController;
