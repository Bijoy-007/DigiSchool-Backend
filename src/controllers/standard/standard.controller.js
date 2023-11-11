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

  async getStandardBySchool(req, res, next) {
    try {
      const schoolId = req.body;

      const standardDetails = await StandardService.getStandardBySchool(
        schoolId,
      );

      return res.status(201).json({
        status: "success",
        message: "Standard found successfully",
        data: standardDetails,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateStandard(req, res, next) {
    try {
      const payload = req.body;

      const standardDetails = await StandardService.updateStandard(
        payload,
      );

      return res.status(201).json({
        status: "success",
        message: "Standard updated successfully",
        data: standardDetails,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new StandardController();
