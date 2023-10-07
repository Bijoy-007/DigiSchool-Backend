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

  async validateRefreshToken(refreshToken, ipAddress) {
    return new Promise(async (resolve, reject) => {
      try {
        /**
         ** Decoding the refresh token first. If the refresh token is valid then
         ** it will contain the schoolId inside the {id} key
         ** The syntax {id: schoolId} = ..... just means I am destructuring an object and taking
         ** the {id} key and re-naming its as {schoolId}
         */
        const { id: schoolId } = jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET_KEY
        );

        // * Finding the refresh token in the DB
        const foundRefreshToken = await RefreshToken.findOne({
          token: refreshToken,
          // * The shoolId should be the same the encrypted schoolId
          schoolId: schoolId,
          /**
           ** The request to refresh the access token should come from the same IP address
           ** to which which this refresh token was being assigned to. Hence matching IP
           */
          ipAddress,
          // * When the user logs out then the refresh token will be marked as DELETED
          isDeleted: false,
        });

        /**
         ** If we get a refresh token in the DB which fulfills all the conditions
         ** that means that refresh token is valid and we should return validated
         */

        if (foundRefreshToken) {
          resolve({
            isValidated: true,
            schoolId,
          });
        } else {
          /**
           ** You might think that status should be Not Found and a message according to that BUT
           ** please note the client should only that the token is in-valid there is no need to
           ** expore the internal implemenation of our security system . If the refresh token is not
           ** present in the DB that's not our fault so we should not disclose that.
           */
          reject(
            new Error("Invalid refresh token. Can't create a access token.", {
              cause: { indicator: "auth", status: 401 },
            })
          );
        }
      } catch (err) {
        /**
         ** Handling errors in case if JWT verification fails. If JWT verification fails then
         ** the error will be TokenExpiredError or JsonWebTokenError or NotBeforeError
         */
        if (
          err.name === "TokenExpiredError" ||
          err.name === "JsonWebTokenError" ||
          err.name === "NotBeforeError"
        ) {
          reject(
            new Error(err.message, {
              cause: { indicator: "auth", status: 401, details: err },
            })
          );
        }
        reject(err);
      }
    });
  }
}

export default Object.freeze(new AuthHelper());
