import bcrypt from "bcrypt";

import AuthHelper from "../helpers/auth.helper.js";
import schoolModel from "../models/school.model.js";

class AuthService {
  constructor() {}
  /**
   * This function is responsible for logging in user using **email** and **password**
   * @param {*} email
   * @param {*} password
   * @returns {*} {accessToken: string, refreshToken: string}
   */
  async login(email, password, ipAddress) {
    return new Promise(async (resolve, reject) => {
      try {
        // * First checking wheather the user is registered or not
        const foundSchool = await schoolModel.findOne({ email });
        console.log("foundSchool = ", foundSchool);
        if (!foundSchool) {
          throw new Error("No school found with the given email!", {
            cause: { indicator: "not_found", status: 400 },
          });
        }

        // * Comparing password
        const isCorrect = await bcrypt.compare(password, foundSchool.password);

        // * If the password is wrong
        if (!isCorrect) {
          throw new Error("Incorrect password. Please provide the correct password!", {
            cause: { indicator: "auth", status: 401 },
          });
        }

        const { accessToken, refreshToken } = await AuthHelper.generateTokens(
          foundSchool._id,
          ipAddress
        );

        // * If everyting was successful
        resolve({
          accessToken,
          refreshToken,
        });
      } catch (err) {
        reject(err);
      }
    });
  }
}

/**
 * By using Object.freeze() we are making sure that this object is immutable
 */
export default Object.freeze(new AuthService());
