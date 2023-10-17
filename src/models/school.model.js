import mongoose from "mongoose";
const { Schema } = mongoose;

const schoolSchema = new Schema(
  {
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
    isDeleted: {
      type: Schema.Types.Boolean,
      default: false
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("school", schoolSchema);
