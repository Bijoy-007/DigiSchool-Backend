import jwt from "jsonwebtoken";

class VerifyJWT {
  constructor() {}

  verifyResetPasswordJWT = async (token) => {
    return new Promise((resolve, reject) => {
      try {
        const { id: schoolId } = jwt.verify(
          token,
          process.env.FORGET_PASSWORD_TOKEN
        );

        if (!schoolId) {
          new Error("Invalid Link", {
            cause: { indicator: "auth", status: 402 },
          });
        }

        resolve({ schoolId });
      } catch (error) {
        if (error?.name === "TokenExpiredError") {
          reject(
            new Error("Link expired", {
              cause: { indicator: "auth", status: 402 },
            })
          );
        } else if (error?.name === "JsonWebTokenError") {
          reject(
            new Error("Invalid link", {
              cause: { indicator: "auth", status: 402 },
            })
          );
        }
        reject(error);
      }
    });
    
  };

  verifySchoolJWT = async (token) => {
    return new Promise((resolve, reject) => {
      try {
        const { id: schoolId } = jwt.verify(
          token,
          process.env.CREATED_SCHOOL_TOKEN
        );
  
        if (!schoolId) {
          new Error("Invalid Link", {
            cause: { indicator: "auth", status: 402 },
          });
        }
  
        resolve({schoolId});
      } catch (error) {
        if (error?.name === "TokenExpiredError") {
          reject(
            new Error("Link expired", {
              cause: { indicator: "auth", status: 402 },
            })
          );
        } else if (error?.name === "JsonWebTokenError") {
          reject(
            new Error("Invalid link", {
              cause: { indicator: "auth", status: 402 },
            })
          );
        }
        reject(error);
      }
    });
  };
}

export default new VerifyJWT();
