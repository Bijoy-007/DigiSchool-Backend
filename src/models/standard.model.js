import mongoose from "mongoose";
const { Schema } = mongoose;

const standardSchema = new Schema(
  {
    standard_name: {
      type: Schema.Types.String,
      required: true,
    },
    schoolId: {
      type: Schema.Types.String,
      required: true,
      ref: "School"
    },
    sections: [
      {
        label: {
          type: Schema.Types.String,
          required: true,
        },
        value: {
          type: Schema.Types.String,
          required: true,
        },
      },
    ],
    isDeleted: {
      type: Schema.Types.Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("standard", standardSchema);
