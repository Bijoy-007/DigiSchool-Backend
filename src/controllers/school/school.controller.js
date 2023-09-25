import bcrpt from "bcrypt";
import SchoolModel from "../../models/school.model.js";

class SchoolController {
  /**
   * Controller to create a new school
   * @param {username}
   * @param {password}
   * @param {schoolName}
   * @param {highestGrade}
   * @param {lowestGrade}
   * @param {email}
   */
  async createNewSchool(req, res, next) {
    try {
      console.log(req.body);
      const payload = req.body;

      const { username, password, schoolName, highestGrade, lowestGrade, email } =
        payload;

      // * Hashing the pasword
      const hash = await bcrpt.hash(password, 12);

      // * Creating and saving a new school record
      const newSchool = new SchoolModel({
        username,
        password: hash,
        schoolName,
        highestGrade,
        lowestGrade,
        email
      });

      const savedSchool = await newSchool.save();

      console.log("Saved school", savedSchool);

      // * If saved successfully
      if(savedSchool) {
        res.status(201).json({
          status: "success",
          message: "School created successfully",
          data: { username, id: savedSchool?._doc?._id, email },
        });
      } else
        throw Error("Something went wrong!");
    } catch (error) {
      console.error(error);
    }
  }
}

export default SchoolController;
