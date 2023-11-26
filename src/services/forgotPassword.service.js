import bcrpt from "bcrypt";
import jwt from "jsonwebtoken";
import SchoolModel from "../models/school.model.js";
import EmailHelper from "../helpers/util/email.helper.js";
import EmailTemplate from "../helpers/assets/emailTemplate.js";
import VerifyJWT from "../helpers/util/verifyJWT.js";

class ForgotPasswordService {
  constructor() {}

  async sendPasswordResetEmail(payload) {
    return new Promise(async (resolve, reject) => {
      try {
        const email = payload.email;
        const foundSchool = await SchoolModel.findOne({ email: email, isVerified: true });

        if (!foundSchool) {
          reject(
            new Error("No School Found in this email", {
              cause: { indicator: "db", status: 404 },
            })
          );
        }
        /* If the school is present then we will generate a link with the help of schoolId
           and jwt token which will be sent to the school's email. */

        const token = jwt.sign(
          { id: foundSchool?._id },
          process.env.FORGET_PASSWORD_TOKEN,
          { expiresIn: "3600s" }
        );

        foundSchool.verifytoken = token;
        const setSchoolToken = await foundSchool.save();

        if (!setSchoolToken) {
          reject(
            new Error("Can not Add Token", {
              cause: { indicator: "db", status: 500 },
            })
          );
        }

        const template =  EmailTemplate.getForgetPasswordEmailTemplate(foundSchool.schoolName, token);


        const sendEmailResult = await EmailHelper.sendEmail(
          foundSchool?.email,
          "Reset Password Link",
          template,
        )

        if(!sendEmailResult){
          reject(
            new Error("Can not send email, try after some time", {
              cause: { indicator: "db", status: 500 },
            })
          );
        }

        resolve(sendEmailResult);
      } catch (error) {
        reject(error);
      }
    });
  }

  async resetPassword(payload) {
    return new Promise(async (resolve, reject) => {
      try {
        const { token, newPassword, confirmPassword } = payload;
        const {schoolId} = await VerifyJWT.verifyResetPasswordJWT(token);

        const foundSchool = await SchoolModel.findOne({
          _id: schoolId,
          verifytoken: token,
        });

        if (!foundSchool) {
          reject(
            new Error("Either incorrect email or the link is invalid", {
              cause: { indicator: "db", status: 404 },
            })
          );
          return;
        }

        const verifyToken = jwt.verify(
          token,
          process.env.FORGET_PASSWORD_TOKEN
        );

        if (!verifyToken) {
          reject(
            new Error("Invalid Token", {
              cause: { indicator: "db", status: 404 },
            })
          );
          return;
        }

        if (newPassword !== confirmPassword) {
          reject(
            new Error("This new password doesn't match with confirm password", {
              cause: { indicator: "db", status: 404 },
            })
          );
          return;
        }

        const hash = await bcrpt.hash(newPassword, 12);

        foundSchool.password = hash;
        foundSchool.verifytoken = "";

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
}

export default new ForgotPasswordService();
