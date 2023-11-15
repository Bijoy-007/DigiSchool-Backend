import jwt from "jsonwebtoken";

const checkAuth = (req, res, next) => {
  try {
    // * Checking for Authorization Header
    const auth = req.headers.authorization;

    // * If no Bearer token was passed
    if (!auth || !auth.startsWith("Bearer ")) {
      throw new Error("No authentication token attached", {
        cause: { indicator: "auth", status: 401 },
      });
    }
    // * Parsing the token
    const token = req.get("Authorization").split(" ")[1];

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);

    // * If the token has expired or invalid
    if (!decoded) {
      throw new Error("Invalid token. Can not authenticate :(", {
        cause: { indicator: "auth", status: 401, details: err },
      });
    }

    // * Attcahing the decrypted schoolId to the req.body
    const { id } = decoded;
    req.body.schoolId = id;

    next();
  } catch (err) {
    next(
      new Error("Invalid token. Can not authenticate :(", {
        cause: { indicator: "auth", status: 401, details: err },
      })
    );
  }
};

export default checkAuth;
