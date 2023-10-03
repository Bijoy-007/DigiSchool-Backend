import AuthService from "../../services/auth.service.js";

class AuthController {
  constructor() {}

  /**
   * Controller to create a new school
   * @param {req.body} contains the following properties
   * @param {email}
   * @param {password}
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const { accessToken, refreshToken } = await AuthService.login(
        email,
        password,
        req.ip
      );

      return res.status(200).json({
        status: "success",
        message: "User authenticated successfully",
        data: {
          accessToken,
          refreshToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default AuthController;
