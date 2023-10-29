import StandardModel from "../models/standard.model.js";

class StandardService {
  constructor() {}

  async createStandard(schoolId, standard_name, sections) {
    return new Promise(async (resolve, reject) => {
      try {
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
}

/**
 * By using Object.freeze() we are making sure that this object is immutable
 */
export default Object.freeze(new StandardService());
