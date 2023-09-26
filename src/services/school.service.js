import bcrpt from "bcrypt";

import SchoolModel from "../models/school.model.js";

class SchoolService {
  constructor() {}
  async createNewSchool(payload) {
    return new Promise(async (resolve, reject) => {
      const {
        username,
        password,
        schoolName,
        highestGrade,
        lowestGrade,
        email,
      } = payload;
      try {
        /**
         * If another school is present with the same Email
         */
        const isSchoolFound = await SchoolModel.findOne({ email });
        if (isSchoolFound) {
          reject(
            new Error("This email is already used by some other school", {
              cause: { indicator: "db", status: 400 },
            })
          );
          return;
        }
        /**
         * IF the school is not present then hashing the password and creating
         * a new school record
         */

        const hash = await bcrpt.hash(password, 12);

        const newSchool = new SchoolModel({
          username,
          password: hash,
          schoolName,
          highestGrade,
          lowestGrade,
          email,
        });

        const createdSchool = await newSchool.save();

        /**
         * IF the school is created succesully then resolving with the created doc
         * Otherwise rejecting the promise
         */
        if (createdSchool) {
          resolve(createdSchool._doc);
        } else {
          reject(
            new Error("Cannot create school. Something went wrong!", {
              cause: { indicator: "db", status: 500 },
            })
          );
        }
      } catch (err) {
        reject(err);
      }
    });
  }
}

export default new SchoolService();
