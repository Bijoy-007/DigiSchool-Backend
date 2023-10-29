import StandardService from "../../services/standard.service.js";

class StandardController {
  constructor() {}

  async createStandard(req, res, next) {
    try {
      const { schoolId, standard_name, sections } = req.body;

      const standardDetails = await StandardService.createStandard(
        schoolId,
        standard_name,
        sections
      );

      return res.status(201).json({
        status: "success",
        message: "Standard created successfully",
        data: standardDetails,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new StandardController();
