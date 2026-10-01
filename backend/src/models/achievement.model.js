import mongoose, { Schema } from "mongoose";

const achievementSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true,
      trim: true
    },

    date: {
      type: Date,
      required: true
    },

    organization: {
      type: String,
      required: true,
      trim: true
    },

    link: {
      type: String,
      default: "",
      trim: true
    }
  },
  {
    timestamps: true
  }
);

export const Achievement = mongoose.model(
  "Achievement",
  achievementSchema
);