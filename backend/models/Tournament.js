import { Schema, model } from "mongoose";

const tournamentSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

export const Tournament = model("Tournament", tournamentSchema);
