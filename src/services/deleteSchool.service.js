import bcrpt from "bcrypt";
import SchoolModel from "../models/school.model.js";

class DeleteSchoolService {
  async deleteSchoolServiceFunction(payload, res) {
    const { username, password, schoolName, email } = payload;

    try {
      const findSchool = await SchoolModel.findOne({ email });
      if (!findSchool) {
        res.status(400).json({
          status: "failed",
          message: "No school found in this email",
        });
      } else {
        /**
         * IF the school is present then hashing the password and matching
         * with the password
         */
        bcrpt.compare(password, findSchool.password, (bcryptErr, result) => {
          if (bcryptErr) throw bcryptErr;

          if (result) {
            console.log("Password is correct");
            // Now deleting the School if the password is correct.
            SchoolModel.deleteOne({ username }).then((data) => {
              console.log("Data deleted");
              res.status(201).json({
                status: "success",
                message: "School deleted successfully",
                data: {
                  username: findSchool?.username,
                  id: findSchool?._id,
                  email: findSchool?.email,
                  schoolName: findSchool?.schoolName,
                },
              });
            });
          } else {
            //* Password does not match
            res.status(400).json({
              status: "failed",
              message: "Password incorrect",
            });
          }
        });
      }
    } catch (err) {
      console.log("error", err);
    }
  }
}
export default DeleteSchoolService;
