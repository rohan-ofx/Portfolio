import APiError from "../utils/ApiErrors.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asynchandler.js";
import { SiteSettings } from "../models/siteSettings.controllers.js";


// Create Site Settings
const createSiteSettings = asyncHandler(async (req, res) => {
  const {
    name,
    title,
    bio,
    profileImage,
    location,
    resumeUrl
  } = req.body;

  if (!name || !title || !bio) {
    throw new APiError(
      400,
      "Name, title and bio are required"
    );
  }

  const existingSettings = await SiteSettings.findOne();

  if (existingSettings) {
    throw new APiError(
      400,
      "Site settings already exist"
    );
  }

  const siteSettings = await SiteSettings.create({
    name,
    title,
    bio,
    profileImage,
    location,
    resumeUrl
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      siteSettings,
      "Site settings created successfully"
    )
  );
});


// Get Site Settings
const getSiteSettings = asyncHandler(async (req, res) => {
  const siteSettings = await SiteSettings.findOne();

  if (!siteSettings) {
    throw new APiError(
      404,
      "Site settings not found"
    );
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      siteSettings,
      "Site settings fetched successfully"
    )
  );
});


// Update Site Settings
const updateSiteSettings = asyncHandler(async (req, res) => {
  const {
    name,
    title,
    bio,
    profileImage,
    location,
    resumeUrl
  } = req.body;

  if (!name || !title || !bio) {
    throw new APiError(
      400,
      "Name, title and bio are required"
    );
  }

  const siteSettings = await SiteSettings.findOneAndUpdate(
    {},
    {
      name,
      title,
      bio,
      profileImage,
      location,
      resumeUrl
    },
    {
      new: true,
      runValidators: true
    }
  );

  if (!siteSettings) {
    throw new APiError(
      404,
      "Site settings not found"
    );
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      siteSettings,
      "Site settings updated successfully"
    )
  );
});


// Delete Site Settings
const deleteSiteSettings = asyncHandler(async (req, res) => {
  const siteSettings = await SiteSettings.findOneAndDelete();

  if (!siteSettings) {
    throw new APiError(
      404,
      "Site settings not found"
    );
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      siteSettings,
      "Site settings deleted successfully"
    )
  );
});


export {
  createSiteSettings,
  getSiteSettings,
  updateSiteSettings,
  deleteSiteSettings
};