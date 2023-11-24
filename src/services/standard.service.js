import StandardModel from "../models/standard.model.js";

class StandardService {
  constructor() {}

  async createStandard(schoolId, standard_name, sections) {
    return new Promise(async (resolve, reject) => {
      try {
        const isStandardFound = await StandardModel.find({
          schoolId,
          standard_name,
          isDeleted: false,
        });

        if (isStandardFound?.length) {
          reject(
            new Error("Duplicate standard found", {
              cause: { indicator: "db", status: 404 },
            })
          );
          return;
        }
        const newStandard = new StandardModel({
          standard_name,
          schoolId,
          sections,
        });

        const savedStandard = await newStandard.save();

        if (savedStandard) {
          resolve(savedStandard._doc);
        } else {
          throw new Error("Can not create new standard", {
            cause: { indicator: "db", status: 500 },
          });
        }
      } catch (err) {
        reject(err);
      }
    });
  }

  async getStandardBySchool(payload) {
    return new Promise(async (resolve, reject) => {
      const schoolId = payload.schoolId;
      try {
        // * Checking if the standard is available or not
        const isStandardFound = await StandardModel.find({
          schoolId: schoolId,
          isDeleted: false,
        });

        if (!isStandardFound) {
          reject(
            new Error("No standard found", {
              cause: { indicator: "db", status: 404 },
            })
          );
          return;
        }
        // * If the Standard is found we will resolve it
        resolve(isStandardFound);
      } catch (err) {
        reject(err);
      }
    });
  }

  async updateStandard(payload) {
    return new Promise(async (resolve, reject) => {
      const { standard_id, standard_name, sections, schoolId } = payload;

      try {
        // * Checking if the standard is available or not
        const isStandardFound = await StandardModel.findOne({
          schoolId,
          _id: standard_id,
        });

        if (!isStandardFound) {
          reject(
            new Error("No standard found", {
              cause: { indicator: "db", status: 404 },
            })
          );
          return;
        }

        // Update the standard's properties
        isStandardFound.standard_name = standard_name;
        isStandardFound.sections = sections;

        const setIsUpdated = await isStandardFound.save();

        resolve(setIsUpdated);
      } catch (err) {
        console.log("ERR =", err);
        reject(err);
      }
    });
  }

  async deleteStandard(payload) {
    return new Promise(async (resolve, reject) => {
      const _id = payload.standard_id;

      try {
        const foundStandard = await StandardModel.findOne({ _id });

        if (!foundStandard || foundStandard.isDeleted === true) {
          reject(
            new Error("This Standard is not found", {
              cause: { indicator: "db", status: 404 },
            })
          );
          return;
        }
        foundStandard.isDeleted = true;
        const setStandardDeleted = await foundStandard.save();

        resolve(setStandardDeleted);
      } catch (error) {
        reject(error);
      }
    });
  }
}

/**
 * By using Object.freeze() we are making sure that this object is immutable
 */
export default Object.freeze(new StandardService());
