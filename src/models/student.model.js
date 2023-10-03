import mongoose from "mongoose";
import schoolModel from "./school.model.js";

const { Schema } = mongoose;

const studentSchema = new Schema(
  {
    name: {
      type: Schema.Types.String,
      required: true,
    },
    parentName: {
      type: Schema.Types.String,
      required: true,
    },
    gender: {
      type: Schema.Types.String,
      required: true,
    },
    standard: {
      type: Schema.Types.String,
      required: true,
    },
    section: {
      type: Schema.Types.String,
      required: true,
    },
    roll: {
      type: Schema.Types.String,
      required: true,
    },
    mobileNo: {
      type: Schema.Types.String,
      required: true,
    },
    address: {
      type: Schema.Types.String,
      required: true,
    },
    bloodGroup: {
      type: Schema.Types.String,
      required: true,
    },
    isDeleted: {
      type: Schema.Types.Boolean,
      default: false,
    },
    schoolId: {
      type: Schema.Types.ObjectId,
      ref: "schools",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("students", studentSchema);
