import SchoolModel from "../models/school.model.js";

class SchoolService {
    // * default constructor
    constructor() {}

    async schoolService(payload,res) {
        return new Promise(async () => {
        const {
            username,
            password,
            schoolName,
            highestGrade,
            lowestGrade,
            email,
          } = payload;
        
        try {
            // * checking if the school is available or not
            const isSchoolFound = await SchoolModel.findOne({ email });
            if (!isSchoolFound) {
                res.status(404).json({
                    status: "failed",
                    message: "No school found in this email",
                });
              return;
            } else{
                res.status(201).json({
                    status: "success",
                    message: "One record found",
                    data: isSchoolFound
                });
                return;
            }
        }catch(err) {
            res.status(500).json({
                status: "failed",
                message: "server issue",
            });
        }
    });
  }
}
export default new SchoolService();