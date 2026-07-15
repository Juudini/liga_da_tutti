import { Schema, model } from "mongoose";

const teamSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    dt: { type: String, trim: true },
    logoUrl: { type: String, trim: true, default: null },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

export const Team = model("Team", teamSchema);
