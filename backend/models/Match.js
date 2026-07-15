import { Schema, model } from "mongoose";

const goalSchema = new Schema(
  {
    playerNumber: { type: Number, required: true, min: 1 },
    playerName: { type: String, required: true, trim: true },
    minute: { type: Number, required: true, min: 0, max: 130 },
    team: { type: String, enum: ["local", "visitor"], required: true },
  },
  { _id: false },
);

const cardSchema = new Schema(
  {
    playerNumber: { type: Number, required: true, min: 1 },
    playerName: { type: String, required: true, trim: true },
    minute: { type: Number, required: true, min: 0, max: 130 },
    team: { type: String, enum: ["local", "visitor"], required: true },
    cardType: { type: String, enum: ["amarilla", "roja"], required: true },
  },
  { _id: false },
);

const matchSchema = new Schema(
  {
    localTeam: { type: Schema.Types.ObjectId, ref: "Team", required: true },
    visitorTeam: { type: Schema.Types.ObjectId, ref: "Team", required: true },

    tournament: {
      type: Schema.Types.ObjectId,
      ref: "Tournament",
      default: null,
    },
    date: { type: Date, required: true },
    stadium: { type: String, trim: true },
    status: {
      type: String,
      enum: ["programado", "finalizado", "cancelado"],
      default: "programado",
    },
    localGoals: { type: Number, min: 0, default: null },
    visitorGoals: { type: Number, min: 0, default: null },
    goals: { type: [goalSchema], default: [] },
    cards: { type: [cardSchema], default: [] },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

export const Match = model("Match", matchSchema);
