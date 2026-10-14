import APiError from "../utils/ApiErrors.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asynchandler.js";
import uploadResume from "../utils/resumeUpload.js";
import { SiteSettings } from "../models/siteSettings.models.js";
import uploadToCloudinary from "../utils/cloudinaryUpload.js";
import cloudinary from "../config/cloudinary.js";
// Create Site Settings
const createSiteSettings = asyncHandler(async (req, res) => {
  const {
    name,
    title,
    bio,
    email,
    phone,
    profileImage,
    location,
    githubUrl,
    linkedinUrl,
    leetcodeUrl,
    resumeUrl,
  } = req.body;

  if (!name?.trim() || !title?.trim()) {
    throw new APiError(400, "Name and title are required");
  }

  const existingSettings = await SiteSettings.findOne();

  if (existingSettings) {
    throw new APiError(400, "Site settings already exist");
  }

  let finalResumeUrl = resumeUrl || "";

  if (req.file) {
    finalResumeUrl = await uploadResume(req.file.buffer);
  }

  const siteSettings = await SiteSettings.create({
    name,
    title,
    bio: bio ?? "",
    email: email ?? "",
    phone: phone ?? "",
    profileImage: profileImage ?? "",
    location: location ?? "",
    githubUrl: githubUrl ?? "",
    linkedinUrl: linkedinUrl ?? "",
    leetcodeUrl: leetcodeUrl ?? "",
    resumeUrl: finalResumeUrl,
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
    throw new APiError(404, "Site settings not found");
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
    email,
    phone,
    profileImage,
    location,
    githubUrl,
    linkedinUrl,
    leetcodeUrl,
    resumeUrl,
  } = req.body;

  if (!name?.trim() || !title?.trim()) {
    throw new APiError(400, "Name and title are required");
  }

  const siteSettings = await SiteSettings.findOne();

  if (!siteSettings) {
    throw new APiError(404, "Site settings not found");
  }

  // Update only fields supplied by the request
  const fields = {
    name,
    title,
    bio,
    email,
    phone,
    profileImage,
    location,
    githubUrl,
    linkedinUrl,
    leetcodeUrl,
  };

  for (const [key, value] of Object.entries(fields)) {
    if (value !== undefined) {
      siteSettings[key] = value;
    }
  }

  if (req.file) {
    siteSettings.resumeUrl = await uploadResume(req.file.buffer);
  } else if (resumeUrl !== undefined) {
    siteSettings.resumeUrl = resumeUrl;
  }

  await siteSettings.save();

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
    throw new APiError(404, "Site settings not found");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      siteSettings,
      "Site settings deleted successfully"
    )
  );
});

const updateProfileImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new APiError(400, "Profile image is required");
  }

  const siteSettings = await SiteSettings.findOne();

  if (!siteSettings) {
    throw new APiError(404, "Site settings not found");
  }

  // Upload new image first
  const uploadedImage = await uploadToCloudinary(
    req.file.buffer,
    "portfolio/profile"
  );

  const oldPublicId = siteSettings.profileImage?.publicId;

  siteSettings.profileImage = {
    url: uploadedImage.url,
    publicId: uploadedImage.publicId,
  };

  await siteSettings.save();

  // Delete old Cloudinary image after successful save
  if (oldPublicId && oldPublicId !== uploadedImage.publicId) {
    try {
      await cloudinary.uploader.destroy(oldPublicId);
    } catch (error) {
      console.error("Old profile image cleanup failed:", error);
    }
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      siteSettings,
      "Profile image updated successfully"
    )
  );
});


export {
  createSiteSettings,
  getSiteSettings,
  updateSiteSettings,
  deleteSiteSettings,
  updateProfileImage,
};