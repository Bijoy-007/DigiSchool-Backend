import AuthService from "../../services/auth.service.js";

class AuthController {
  constructor() {}

  /**
   * Controller to login aka generating accessToken and refreshToken
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

  /**
   * Controller to generate accessToken using refreshToken
   * @param {req.body} contains the following properties
   * @param {refreshToken}
   */
  async refreshAccessToken(req, res, next) {
    try {
      const { refreshToken } = req.body;

      const { accessToken } = await AuthService.refreshAccessToken(
        refreshToken,
        req.ip
      );

      return res.status(200).json({
        status: "success",
        message: "Access token generated successfully!",
        data: {
          accessToken,
        },
      });
    } catch (err) {
      next(err);
    }
  }
}

export default AuthController;
