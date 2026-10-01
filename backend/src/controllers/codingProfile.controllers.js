import APiError from "../utils/ApiErrors.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asynchandler.js";
import { CodingProfile } from "../models/codingprofile.model.js";


// CREATE CODING PROFILE
const createCodingProfile = asyncHandler(async (req, res) => {
  const {
    platform,
    username,
    profileUrl,
    icon,
    description,
    order
  } = req.body;

  if (!platform || !username || !profileUrl) {
    throw new APiError(
      400,
      "Platform, username and profile URL are required"
    );
  }

  const codingProfile = await CodingProfile.create({
    platform,
    username,
    profileUrl,
    icon,
    description,
    order
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      codingProfile,
      "Coding profile created successfully"
    )
  );
});


// GET ALL CODING PROFILES
const getAllCodingProfiles = asyncHandler(async (req, res) => {
  const codingProfiles = await CodingProfile.find().sort({
    order: 1
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      codingProfiles,
      "Coding profiles fetched successfully"
    )
  );
});


// GET CODING PROFILE BY ID
const getCodingProfileById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const codingProfile = await CodingProfile.findById(id);

  if (!codingProfile) {
    throw new APiError(
      404,
      "Coding profile not found"
    );
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      codingProfile,
      "Coding profile fetched successfully"
    )
  );
});


// UPDATE CODING PROFILE
const updateCodingProfile = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const {
    platform,
    username,
    profileUrl,
    icon,
    description,
    order
  } = req.body;

  if (!platform || !username || !profileUrl) {
    throw new APiError(
      400,
      "Platform, username and profile URL are required"
    );
  }

  const updatedCodingProfile =
    await CodingProfile.findByIdAndUpdate(
      id,
      {
        platform,
        username,
        profileUrl,
        icon,
        description,
        order
      },
      {
        new: true,
        runValidators: true
      }
    );

  if (!updatedCodingProfile) {
    throw new APiError(
      404,
      "Coding profile not found"
    );
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      updatedCodingProfile,
      "Coding profile updated successfully"
    )
  );
});


// DELETE CODING PROFILE
const deleteCodingProfile = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deletedCodingProfile =
    await CodingProfile.findByIdAndDelete(id);

  if (!deletedCodingProfile) {
    throw new APiError(
      404,
      "Coding profile not found"
    );
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      deletedCodingProfile,
      "Coding profile deleted successfully"
    )
  );
});


export {
  createCodingProfile,
  getAllCodingProfiles,
  getCodingProfileById,
  updateCodingProfile,
  deleteCodingProfile
};