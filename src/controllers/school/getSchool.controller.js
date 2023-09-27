import SchoolModel from "../../models/school.model.js";
import SchoolService from "../../services/getSchool.service.js";

class GetSchoolController {
  constructor() {}

  async getSchool(req, res, next) {
    // * Storing the requested object length on obj_length const
    // * as in javascript we can not find the object body length by default
    const obj_length = Object.keys(req.body).length;

    if (obj_length === 0) {
      SchoolModel.find({}).then((data) => {
        if (data.length === 0) {
          res.status(201).json({
            status: "success",
            message: "No schools has been added",
          });
        } else {
          res.status(201).json({
            status: "success",
            message: "All the available schools",
            data: data,
          });
        }
      });
    } else {
      // * Getting the requested school with the given payload
      const getSchoolDetails = await SchoolService.schoolService(req.body, res);
    }
  }
  catch(err) {
    console.log("error", err);
  }
}
export default GetSchoolController;
