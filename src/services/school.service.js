import bcrpt from "bcrypt";
import jwt from "jsonwebtoken";
import SchoolModel from "../models/school.model.js";
import EmailHelper from "../helpers/util/email.helper.js";
import EmailTemplate from "../helpers/assets/emailTemplate.js";

class SchoolService {
  constructor() {}
  async createNewSchool(payload) {
    return new Promise(async (resolve, reject) => {
      try {
        const { password, confirm_Password, schoolName, email } = payload;
        /**
         * If another school is present with the same Email
         */
        if (password !== confirm_Password) {
          reject(
            new Error("Passwords are differnt", {
              cause: { indicator: "db", status: 404 },
            })
          );
          return;
        }
        const isSchoolFound = await SchoolModel.findOne({
          email,
          isVerified: true,
        });
        if (isSchoolFound) {
          reject(
            new Error("This email is already used by some other school", {
              cause: { indicator: "db", status: 404 },
            })
          );
          return;
        }
        /**
         * IF the school is not present then hashing the password and creating
         * a new school record with isVerified === false
         */

        const hash = await bcrpt.hash(password, 12);

        const newSchool = new SchoolModel({
          password: hash,
          schoolName,
          email,
        });

        const createdSchool = await newSchool.save();

        /**
         * IF the school is created succesully then sending mail and resolving with the created doc
         * Otherwise rejecting the promise
         */
        if (createdSchool) {
          /* If the school is present then we will generate a link with the help of schoolId
           and jwt token which will be sent to the school's email. */

          const token = jwt.sign(
            { id: createdSchool?._id },
            process.env.CREATED_SCHOOL_TOKEN,
            { expiresIn: "1d" }
          );

          createdSchool.verifytoken = token;
          const setSchoolToken = await createdSchool.save();

          if (!setSchoolToken) {
            reject(
              new Error("Can not Add Token", {
                cause: { indicator: "db", status: 500 },
              })
            );
          }

          const template = EmailTemplate.createSchoolTemplate(
            createdSchool.schoolName,
            token
          );

          const EmailResult = await EmailHelper.sendEmail(
            createdSchool.email,
            "Email Verification",
            template
          );

          if (!EmailResult) {
            reject(
              new Error("Can not send email, try after some time", {
                cause: { indicator: "db", status: 500 },
              })
            );
          }
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

  async getSchool(payload) {
    return new Promise(async (resolve, reject) => {
      const { email } = payload;
      try {
        // * Checking if the school is available or not
        const isSchoolFound = await SchoolModel.findOne({ email });
        if (!isSchoolFound) {
          reject(
            new Error("This School is not found", {
              cause: { indicator: "db", status: 404 },
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

  async updateSchool(payload) {
    return new Promise(async (resolve, reject) => {
      const { username, schoolName, email } = payload;

      try {
        const foundSchool = await SchoolModel.findOne({ email });

        if (!foundSchool) {
          reject(
            new Error("This School is not found", {
              cause: { indicator: "db", status: 404 },
            })
          );
          return;
        } else {
          // Now updating all the payload values
          foundSchool.email = email;
          foundSchool.schoolName = schoolName;

          const setIsUpdated = await foundSchool.save();

          resolve(setIsUpdated);
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  async changePassword(payload) {
    return new Promise(async (resolve, reject) => {
      const { old_Password, new_Password, confirm_Password, schoolId } =
        payload;

      try {
        const foundSchool = await SchoolModel.findOne({ _id: schoolId });

        if (!foundSchool || foundSchool.isDeleted === true) {
          reject(
            new Error("This School is not found", {
              cause: { indicator: "db", status: 404 },
            })
          );
          return;
        }
        /**
         * IF the school is present then hashing the password and matching
         * with the database's password
         */
        const isCorrectPassword = await bcrpt.compare(
          old_Password,
          foundSchool.password
        );
        if (!isCorrectPassword) {
          reject(
            new Error("This password doesn't match with previous password", {
              cause: { indicator: "db", status: 404 },
            })
          );
          return;
        }
        if (new_Password !== confirm_Password) {
          reject(
            new Error("This new password doesn't match with confirm password", {
              cause: { indicator: "db", status: 404 },
            })
          );
          return;
        }
        const hash = await bcrpt.hash(new_Password, 12);

        foundSchool.password = hash;

        const updatedSchool = await foundSchool.save();

        /**
         * IF the school is updated succesully then resolving with the created doc
         * Otherwise rejecting the promise
         */
        if (updatedSchool) {
          resolve(updatedSchool);
        } else {
          reject(
            new Error("Cannot update school. Something went wrong!", {
              cause: { indicator: "db", status: 500 },
            })
          );
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  async deleteSchool(payload) {
    return new Promise(async (resolve, reject) => {
      const { email, password } = payload;

      try {
        const foundSchool = await SchoolModel.findOne({ email });

        if (!foundSchool || foundSchool.isDeleted === true) {
          reject(
            new Error("This School is not found", {
              cause: { indicator: "db", status: 404 },
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
            foundSchool.password
          );

          if (isCorrectPassword) {
            // Now set isDeleted to true of the School if the password is correct.
            foundSchool.isDeleted = true;
            const setIsUpdated = await foundSchool.save();
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
