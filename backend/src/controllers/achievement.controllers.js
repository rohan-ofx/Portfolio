import APiError from "../utils/ApiErrors.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asynchandler.js";
import { Achievement } from "../models/achievement.model.js";

// CREATE ACHIEVEMENT
const createAchievement = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    date,
    organization,
    link
  } = req.body;

  if (!title || !description || !date) {
    throw new APiError(
      400,
      "Title, description and date are required"
    );
  }

  const achievement = await Achievement.create({
    title,
    description,
    date,
    organization,
    link
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      achievement,
      "Achievement created successfully"
    )
  );
});


// GET ALL ACHIEVEMENTS
const getAllAchievements = asyncHandler(async (req, res) => {
  const achievements = await Achievement.find().sort({
    date: -1
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      achievements,
      "Achievements fetched successfully"
    )
  );
});


// GET ACHIEVEMENT BY ID
const getAchievementById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const achievement = await Achievement.findById(id);

  if (!achievement) {
    throw new APiError(
      404,
      "Achievement not found"
    );
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      achievement,
      "Achievement fetched successfully"
    )
  );
});


// UPDATE ACHIEVEMENT
const updateAchievement = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const {
    title,
    description,
    date,
    organization,
    link
  } = req.body;

  if (!title || !description || !date) {
    throw new APiError(
      400,
      "Title, description and date are required"
    );
  }

  const updatedAchievement =
    await Achievement.findByIdAndUpdate(
      id,
      {
        title,
        description,
        date,
        organization,
        link
      },
      {
        new: true,
        runValidators: true
      }
    );

  if (!updatedAchievement) {
    throw new APiError(
      404,
      "Achievement not found"
    );
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      updatedAchievement,
      "Achievement updated successfully"
    )
  );
});


// DELETE ACHIEVEMENT
const deleteAchievement = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deletedAchievement =
    await Achievement.findByIdAndDelete(id);

  if (!deletedAchievement) {
    throw new APiError(
      404,
      "Achievement not found"
    );
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      deletedAchievement,
      "Achievement deleted successfully"
    )
  );
});


export {
  createAchievement,
  getAllAchievements,
  getAchievementById,
  updateAchievement,
  deleteAchievement
};