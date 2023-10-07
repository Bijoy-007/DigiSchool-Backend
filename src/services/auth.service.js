import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
        if (!foundSchool) {
          throw new Error("No school found with the given email!", {
            cause: { indicator: "not_found", status: 400 },
          });
        }

        // * Comparing password
        const isCorrect = await bcrypt.compare(password, foundSchool.password);

        // * If the password is wrong
        if (!isCorrect) {
          throw new Error(
            "Incorrect password. Please provide the correct password!",
            {
              cause: { indicator: "auth", status: 401 },
            }
          );
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

  /**
   * This function is responsible for generating access-token using refresh token
   * @param {*} refrshToken
   * @param {*} ipAddress
   * @returns {*} {accessToken: string}
   */
  async refreshAccessToken(refreshToken, ipAddress) {
    return new Promise(async (resolve, reject) => {
      try {
        // * Validating the refresh token
        const { isValidated, schoolId } = await AuthHelper.validateRefreshToken(
          refreshToken,
          ipAddress
        );

        if (isValidated) {
          // If the refresh token is validated successfully then creating a new access token
          const accessToken = await jwt.sign(
            { id: schoolId },
            process.env.ACCESS_TOKEN_SECRET_KEY,
            {
              /**
               * 1 Seceond = 1000 Mili seconds
               * So 10 Minutes = 10 X 60 seconds = 10 X 60 X 1000 mili seconds
               */
              expiresIn: 10 * 60 * 100,
            }
          );
          resolve({ accessToken });
        } else {
          reject(
            new Error("Invalid refresh token. Can't create a access token.", {
              cause: { indicator: "auth", status: 401 },
            })
          );
        }

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
