import mongoose, { Schema } from "mongoose";

const codingSchema = new Schema(
  {
    platform: {
      type: String,
      required: true,
      trim: true,
    },

    username: {
      type: String,
      required: true,
      trim: true,
    },

    profileUrl: {
      type: String,
      required: true,
      trim: true,
    },

    // Optional platform logo or icon
    icon: {
      type: String,
      default: "",
      trim: true,
    },

    // Optional profile description
    description: {
      type: String,
      default: "",
      trim: true,
    },

    // Number of problems solved on the platform
    problemsSolved: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Optional competitive programming rating
    rating: {
      type: Number,
      default: null,
      min: 0,
    },

    // Optional platform rank
    rank: {
      type: String,
      default: "",
      trim: true,
    },

    // Display ordering in the portfolio
    order: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const CodingProfile = mongoose.model(
  "CodingProfile",
  codingSchema
);