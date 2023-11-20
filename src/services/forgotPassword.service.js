import bcrpt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import SchoolModel from "../models/school.model.js";

class ForgotPasswordService {
  constructor() {}

  async sendMail(payload) {
    return new Promise(async (resolve, reject) => {
      try {
        const email = payload.email;
        const foundSchool = await SchoolModel.findOne({ email: email });

        if (!foundSchool) {
          reject(
            new Error("No School Found in this email", {
              cause: { indicator: "db", status: 500 },
            })
          );
        }
        /* If the school is present then we will generate a link with the help of schoolId
           and jwt token which will be sent to the school's email. */

        const token = jwt.sign(
          { id: foundSchool?._id },
          process.env.FORGET_PASSWORD_TOKEN,
          { expiresIn: "600s" }
        );

        const setSchoolToken = await SchoolModel.findByIdAndUpdate(
          { _id: foundSchool._id },
          { verifytoken: token },
          { new: true }
        );

        if(!setSchoolToken){
          reject(
            new Error("Token Add failed", {
              cause: { indicator: "db", status: 500 },
            })
          );
        }

        const transporter = nodemailer.createTransport({
          service: "gmail",
          secure: true,
          auth: {
            user: process.env.EMAIL_ID,
            pass: process.env.EMAIL_APP_PASSWORD,
          },
        });

        const mailOptions = {
          from: process.env.EMAIL_ID,
          to: "papaihactoberfest4444@gmail.com",
          subject: "Reset Password Link",
          text: `The link is only valid for 10 minutes http://localhost:3000/reset_password/${foundSchool?._id}/${setSchoolToken.verifytoken}`,
        };

        const sendMailResult = transporter.sendMail(
          mailOptions,
          function (error) {
            if (error) {
              reject(
                new Error("There is a problem sending email", {
                  cause: { indicator: "Internal server", status: 500 },
                })
              );
            }
            const success = "Mail Sent successfully";
            resolve(success);
          }
        );
      } catch (error) {
        reject(error);
      }
    });
  }

  async resetPassword(payload) {
    return new Promise(async(resolve, reject) => {
      try {
        const { id, token, newPassword, confirmPassword } = payload;

        const foundSchool = await SchoolModel.findOne({ _id: id, verifytoken:token });

        if (!foundSchool) {
          reject(
            new Error("This School is not found", {
              cause: { indicator: "db", status: 404 },
            })
          );
          return;
        }

        const verifyToken = jwt.verify(token, process.env.FORGET_PASSWORD_TOKEN);

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
