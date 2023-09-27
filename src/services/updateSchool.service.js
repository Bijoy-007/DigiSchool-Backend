import bcrpt from "bcrypt";
import SchoolModel from "../models/school.model.js";





class UpdateSchoolService {
    constructor() {}

    async updateSchoolServiceFunction(payload, res) {

        const email = payload.email;
        const password = payload.password;

        console.log("The password is: ",password);

        const fieldsToUpdate = {
            username : payload.username,
            password : payload.password,
            schoolName : payload.schoolName,
            highestGrade : payload.highestGrade,
            lowestGrade : payload.lowestGrade,
            email : payload.email,
        };

    // Find the user by email
    const findSchool = [];
    SchoolModel.findOne({ email }).then((data) => {
        console.log("data: ", data);
    });
    console.log("The school is: ",findSchool);
    
        if (!findSchool) {
          console.log('School not found');
          return;
        }
      
        // Compare the provided password with the hashed password stored in the database
        const passwordMatch = await bcrpt.compare(password, findSchool.password);
      
        if (passwordMatch) {
          // Password is correct, update the fields
          SchoolModel.findByIdAndUpdate(
            school._id,
            { $set: fieldsToUpdate },
            { new: true }).then((data) => {
              if (!data) {
                  console.error('Error updating school:', data);
                  res.status(400).json({
                    status: "failed",
                    message: "Error updating school",
                    data: data,
                  });
                } else {
                  console.log('School updated:', data);
                  res.status(201).json({
                    status: "success",
                    message: "School updated successfully",
                    data: data,
                  });
                }
            })
          }else {
          console.log('Password is incorrect');
        }
    }
}
export default new UpdateSchoolService();