import mongoose, { Schema } from "mongoose";

const siteSettingsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    bio: {
      type: String,
      default: "",
      trim: true,
    },

    profileImage: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      default: "",
      trim: true,
    },

    resumeUrl: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export const SiteSettings = mongoose.model(
  "SiteSettings",
  siteSettingsSchema
);