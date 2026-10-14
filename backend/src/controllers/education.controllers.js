import APiError from "../utils/ApiErrors.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asynchandler.js";
import { Education } from "../models/education.model.js";


// CREATE EDUCATION
const createEducation = asyncHandler(async (req, res) => {

  const {
    institution,
    degree,
    fieldOfStudy,
    startDate,
    endDate,
    grade,
    description
  } = req.body;


  if (
    !institution?.trim() ||
    !degree?.trim() ||
    !fieldOfStudy?.trim() ||
    !startDate
  ) {
    throw new APiError(
      400,
      "Institution, degree, field of study and start date are required"
    );
  }
  const parsedStartDate = new Date(startDate);

  if (Number.isNaN(parsedStartDate.getTime())) {
    throw new APiError(400, "Invalid start date");
  }

  let parsedEndDate = null;

  if (endDate) {
    parsedEndDate = new Date(endDate);

    if (Number.isNaN(parsedEndDate.getTime())) {
      throw new APiError(400, "Invalid end date");
    }

    if (parsedEndDate < parsedStartDate) {
      throw new APiError(
        400,
        "End date cannot be earlier than start date"
      );
    }
  }


  const education = await Education.create({
      institution: institution.trim(),
    degree: degree.trim(),
    fieldOfStudy: fieldOfStudy.trim(),
    startDate: parsedStartDate,
    endDate: parsedEndDate,
    grade: grade?.trim() || "",
    description: description?.trim() || "",

  });


  return res.status(201).json(
    new ApiResponse(
      201,
      education,
      "Education created successfully"
    )
  );
});


// GET ALL EDUCATION
const getAllEducation = asyncHandler(async (req, res) => {

  const education = await Education.find()
    .sort({ startDate: -1 });


  return res.status(200).json(
    new ApiResponse(
      200,
      education,
      "Education fetched successfully"
    )
  );
});


// GET EDUCATION BY ID
const getEducationById = asyncHandler(async (req, res) => {

  const { id } = req.params;


  const education = await Education.findById(id);


  if (!education) {
    throw new APiError(
      404,
      "Education not found"
    );
  }


  return res.status(200).json(
    new ApiResponse(
      200,
      education,
      "Education fetched successfully"
    )
  );
});


// UPDATE EDUCATION
const updateEducation = asyncHandler(async (req, res) => {

  const { id } = req.params;

  const {
    institution,
    degree,
    fieldOfStudy,
    startDate,
    endDate,
    grade,
    description
  } = req.body;


  if (
    !institution ||
    !degree ||
    !fieldOfStudy ||
    !startDate
  ) {
    throw new APiError(
      400,
      "Institution, degree, field of study and start date are required"
    );
  }


  const updatedEducation =
    await Education.findByIdAndUpdate(
      id,
      {
        institution,
        degree,
        fieldOfStudy,
        startDate,
        endDate,
        grade,
        description
      },
      {
        new: true,
        runValidators: true
      }
    );


  if (!updatedEducation) {
    throw new APiError(
      404,
      "Education not found"
    );
  }


  return res.status(200).json(
    new ApiResponse(
      200,
      updatedEducation,
      "Education updated successfully"
    )
  );
});


// DELETE EDUCATION
const deleteEducation = asyncHandler(async (req, res) => {

  const { id } = req.params;


  const deletedEducation =
    await Education.findByIdAndDelete(id);


  if (!deletedEducation) {
    throw new APiError(
      404,
      "Education not found"
    );
  }


  return res.status(200).json(
    new ApiResponse(
      200,
      deletedEducation,
      "Education deleted successfully"
    )
  );
});


export {
  createEducation,
  getAllEducation,
  getEducationById,
  updateEducation,
  deleteEducation
};