import jwt from "jsonwebtoken";

import RefreshToken from "../models/refreshToken.model.js";

class AuthHelper {
  /**
   * This function takes the following params and generates the accessToken and refreshToken
   * @param {*} schoolId
   * @param {*} ipAddress
   * @returns {*} {accessToken: string. refreshToken: string}
   */
  async generateTokens(schoolId, ipAddress) {
    return new Promise(async (resolve, reject) => {
      try {
        // Generating the access token
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

        // Generating the refresh token
        const refreshToken = await jwt.sign(
          { id: schoolId },
          process.env.REFRESH_TOKEN_SECRET_KEY,
          {
            /**
             * 1 Seceond = 1000 Mili seconds
             * So 10 Minutes = 10 X 60 seconds = 10 X 60 X 1000 mili seconds
             */
            expiresIn: "30d",
          }
        );

        // * Saving the refreshToken in the DB
        const newRefreshtoken = new RefreshToken({
          token: refreshToken,
          schoolId,
          ipAddress,
        });

        const savedRefreshToken = await newRefreshtoken.save();

        // * If the refresh token was not saved properly
        if (!savedRefreshToken) {
          reject(
            new Error("No school found with the given email!", {
              cause: { indicator: "db", status: 500 },
            })
          );
        } else {
          // * Everything was successful
          resolve({
            accessToken,
            refreshToken,
          });
        }
      } catch (err) {
        reject(err);
      }
    });
  }
}

export default Object.freeze(new AuthHelper());
