import { body } from "express-validator";
import { parse } from "json2csv";

import SchoolModel from "../models/school.model.js";
import StudentModel from "../models/student.model.js";
import studentModel from "../models/student.model.js";

const json2csv = parse;

const CSV_FIELDS = [
  "name",
  "parentName",
  "gender",
  "standard",
  "roll",
  "mobileNo",
  "address",
  "bloodGroup",
];

class StudentService {
  constructor() {}

  async createStudent(payload) {
    return new Promise(async (resolve, reject) => {
      try {
        const {
          name,
          parentName,
          standard,
          section,
          gender,
          roll,
          mobileNo,
          address,
          bloodGroup,
          schoolId,
        } = payload;
        /**
         * If another student is present in the same standard same section
         * with same roll no
         */
        const isStudentFound = await StudentModel.findOne({
          standard,
          section,
          roll,
          schoolId,
        });

        // * Check if the student is already present or not
        // * Reject promise if found duplicacy
        if (isStudentFound) {
          reject(
            new Error("This student is already been admitted", {
              cause: { indicator: "db", status: 404 },
            })
          );
          return;
        }
        const newStudent = new StudentModel({
          name,
          parentName,
          gender,
          standard,
          section,
          roll,
          mobileNo,
          address,
          bloodGroup,
          schoolId,
        });

        const createdStudent = await newStudent.save();

        /**
         * IF the student is created succesully then resolving with the created doc
         * Otherwise rejecting the promise
         */
        if (createdStudent) {
          resolve(createdStudent._doc);
        } else {
          reject(
            new Error("Cannot create Student. Something went wrong!", {
              cause: { indicator: "db", status: 500 },
            })
          );
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  async getStudents() {
    return new Promise(async (resolve, reject) => {
      try {
        // * Checking all the students from Database
        const foundStudents = await StudentModel.find({});

        // * If no students are found reject
        if (!foundStudents) {
          reject(
            new Error("No student found", {
              indicator: "DB",
              status: 404,
            })
          );
          return;
        }
        // * Else resolve
        resolve(foundStudents);
      } catch (error) {
        reject(error);
      }
    });
  }

  async getStudentsBySchool(payload) {
    return new Promise(async (resolve, reject) => {
      try {
        const { schoolId, page, size } = payload;

        const limit = parseInt(size);
        const skip = (page - 1) * size;

        let query = {
          schoolId,
          isDeleted: false,
        };

        // * If search string passed in the payload
        if (payload?.searchString) {
          query = {
            ...query,
            $text: { $search: new RegExp(payload?.searchString, "i") },
          };
        }

        const foundStudents = await studentModel
          .find(query)
          .limit(limit)
          .skip(skip);
        const count = await studentModel.countDocuments(query);

        if (!foundStudents || foundStudents.length < 1) {
          reject(
            new Error("No Students found", {
              cause: { indicator: "db", status: 404 },
            })
          );
        }

        resolve({ studentList: foundStudents, count });
      } catch (error) {
        console.log(error);
      }
    });
  }

  async getStudent(payload) {
    return new Promise(async (resolve, reject) => {
      try {
        const { standard, section, roll, schoolId } = payload;

        if (!foundSchool) {
          reject(
            new Error("There is no school in this email", {
              cause: { indicator: "db", status: 404 },
            })
          );
        }

        // * Checking a single student from Database
        const foundStudent = await StudentModel.findOne({
          schoolId: body.schoolId,
          standard,
          section,
          roll,
        });

        // * If no students are found reject
        if (!foundStudent) {
          reject(
            new Error("No student found", {
              indicator: "DB",
              status: 404,
            })
          );
          return;
        }
        resolve(foundStudent);
      } catch (error) {
        reject(error);
      }
    });
  }

  async updateStudent(payload) {
    return new Promise(async (resolve, reject) => {
      try {
        const {
          standard,
          section,
          roll,
          schoolId,
          nameToUpdate,
          parentNameToUpdate,
          standardToUpdate,
          sectionToUpdate,
          rollToUpdate,
          mobileNoToUpdate,
          addressToUpdate,
          bloodGroupToUpdate,
          genderToUpdate,
        } = payload;

        // * Checking a single student that will be updated
        const foundStudent = await StudentModel.findOne({
          schoolId,
          standard,
          section,
          roll,
        });

        console.log("FoundStudent =", foundStudent);

        // * If no students are found reject
        if (!foundStudent) {
          reject(
            new Error("No student found", {
              indicator: "DB",
              status: 404,
            })
          );
          return;
        }

        const isDuplicateStudent = await StudentModel.findOne({
          name: nameToUpdate,
          parentName: parentNameToUpdate,
          standard: standardToUpdate,
          section: sectionToUpdate,
          roll: rollToUpdate,
          mobileNo: mobileNoToUpdate,
          address: addressToUpdate,
          bloodGroup: bloodGroupToUpdate,
          gender: genderToUpdate,
          schoolId,
        });

        // * Check if the student is already present or not
        // * Reject promise if found duplicacy
        if (isDuplicateStudent) {
          reject(
            new Error("This student is already been admitted", {
              cause: { indicator: "db", status: 404 },
            })
          );
          return;
        }

        console.log("Found Student =", foundStudent);

        // Update the student's properties
        (foundStudent.name = nameToUpdate),
          (foundStudent.parentName = parentNameToUpdate);
        foundStudent.standard = standardToUpdate;
        foundStudent.section = sectionToUpdate;
        foundStudent.roll = rollToUpdate;
        foundStudent.mobileNo = mobileNoToUpdate;
        foundStudent.address = addressToUpdate;
        (foundStudent.bloodGroup = bloodGroupToUpdate),
          (foundStudent.gender = genderToUpdate);

        const setIsUpdated = await foundStudent.save();

        resolve(setIsUpdated);
      } catch (error) {
        reject(error);
      }
    });
  }

  async deleteStudent(payload) {
    return new Promise(async (resolve, reject) => {
      try {
        const { standard, section, roll, email } = payload;

        // * Check if the school exists
        let foundSchool = await SchoolModel.findOne({ email });

        if (!foundSchool) {
          reject(
            new Error("There is no school in this email", {
              cause: { indicator: "db", status: 404 },
            })
          );
        }
        // * Checking a single student from Database
        const foundStudent = await StudentModel.findOne({
          schoolId: foundSchool._id,
          standard,
          section,
          roll,
        });

        // * If no students are found reject
        if (!foundStudent || foundStudent.isDeleted === true) {
          reject(
            new Error("No student found", {
              indicator: "DB",
              status: 404,
            })
          );
          return;
        }
        // As the student is present now setting isDeleted to true
        foundStudent.isDeleted = true;

        const setIsUpdated = await foundStudent.save();
        resolve(setIsUpdated);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   *
   * @param {{
   *   limit: "The number of records to be fetched",
   *   schoolId: "This will be parsed from the JWT"
   * }} payload
   * @returns CSV Blob Data
   */
  async getStudentsDetailsCSV(payload) {
    return new Promise(async (resolve, reject) => {
      try {
        const { limit, schoolId } = payload;

        const query = {
          schoolId,
          isDeleted: false,
        };

        const studentsDetails = await StudentModel.find(query).limit(limit);
        if (!studentsDetails) {
          reject(
            new Error("No students found", {
              indicator: "DB",
              status: 404,
            })
          );
          return;
        }

        // * Converting the JSON data to CSV format
        const csvData = json2csv(studentsDetails, { fields: CSV_FIELDS });

        resolve(csvData);
      } catch (error) {
        reject(error);
      }
    });
  }
}
export default new StudentService();
