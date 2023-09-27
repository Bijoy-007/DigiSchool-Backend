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

  async getSchoolService(payload) {
    return new Promise(async (resolve, reject) => {
      const { email } = payload;
      try {
        // * Checking if the school is available or not
        const isSchoolFound = await SchoolModel.findOne({ email });
        if (!isSchoolFound) {
          reject(
            new Error("This School is not found", {
              cause: { indicator: "db", status: 400 },
            })
          );
          return;
        }

        // * If the School is found we will simply resolve it
        resolve(isSchoolFound);
      } catch (error) {
        reject(error);
      }
    });
  }

  async updateSchoolService(payload) {
    return new Promise(async (resolve, reject) => {
      const { username, schoolName, highestGrade, lowestGrade, email } =
        payload;

      try {
        const findSchool = await SchoolModel.findOne({ email });
        console.log("The school is: ", findSchool);

        if (!findSchool) {
          reject(
            new Error("This School is not found", {
              cause: { indicator: "db", status: 400 },
            })
          );
          return;
        } else {
          // Now updating all the payload values
          findSchool.username = username;
          findSchool.email = email;
          findSchool.schoolName = schoolName;
          findSchool.highestGrade = highestGrade;
          findSchool.lowestGrade = lowestGrade;
          const setIsUpdated = await findSchool.save();

          resolve(setIsUpdated);
          
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  async deleteSchoolService(payload) {
    return new Promise(async (resolve, reject) => {
      const { email, password } = payload;

      try {
        const findSchool = await SchoolModel.findOne({ email });

        if (!findSchool || findSchool.isDeleted === true) {
          reject(
            new Error("This School is not found", {
              cause: { indicator: "db", status: 400 },
            })
          );
          return;
        } else {
          /**
           * IF the school is present then hashing the password and matching
           * with the password
           */
          const isCorrectPassword = await bcrpt.compare(
            password,
            findSchool.password
          );

          if (isCorrectPassword) {
            console.log("Password is correct");
            // Now set isDeleted to true of the School if the password is correct.
            findSchool.isDeleted = true;
            const setIsUpdated = await findSchool.save();
            resolve(setIsUpdated);
          } else {
            //* Password does not match
            reject(
              new Error("Incorrect Password", {
                cause: { indicator: "Wrong Password", status: 404 },
              })
            );
          }
        }
      } catch (error) {
        reject(error);
      }
    });
  }
}

export default new SchoolService();
