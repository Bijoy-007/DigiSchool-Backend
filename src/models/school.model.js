import mongoose from "mongoose";
const { Schema } = mongoose;

const schoolSchema = new Schema(
  {
    username: {
      type: Schema.Types.String,
      required: true,
    },
    email: {
        type: Schema.Types.String,
        required: true,
      },
    password: {
      type: Schema.Types.String,
      required: true,
    },
    schoolName: {
      type: Schema.Types.String,
      required: true,
    },
    lowestGrade: {
      type: Schema.Types.String,
      required: true,
    },
    highestGrade: {
      type: Schema.Types.String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("school", schoolSchema);
