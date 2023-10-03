import mongoose from "mongoose";
const { Schema } = mongoose;

const refreshTokenSchema = new Schema(
  {
    token: {
      type: Schema.Types.String,
      required: true,
    },
    schoolId: {
      type: Schema.Types.String,
      required: true,
    },
    ipAddress: {
      type: Schema.Types.String,
      required: true,
    },
    isDeleted: {
      type: Schema.Types.Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("refreshToken", refreshTokenSchema);
