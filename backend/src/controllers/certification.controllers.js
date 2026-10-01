import APiError from "../utils/ApiErrors.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asynchandler.js";
import { Certificate } from "../models/certificate.model.js";


// CREATE CERTIFICATION
const createCertification = asyncHandler(async (req, res) => {

  const {
    title,
    issuer,
    issueDate,
    credentialId,
    credentialUrl,
    certificateUrl
  } = req.body;


  if (
    !title ||
    !issuer ||
    !issueDate
  ) {
    throw new APiError(
      400,
      "Title, issuer and issue date are required"
    );
  }


  const certification = await Certificate.create({
    title,
    issuer,
    issueDate,
    credentialId,
    credentialUrl,
    certificateUrl
  });


  return res.status(201).json(
    new ApiResponse(
      201,
      certification,
      "Certification created successfully"
    )
  );
});


// GET ALL CERTIFICATIONS
const getAllCertifications = asyncHandler(async (req, res) => {

  const certifications = await Certificate.find()
    .sort({ issueDate: -1 });


  return res.status(200).json(
    new ApiResponse(
      200,
      certifications,
      "Certifications fetched successfully"
    )
  );
});


// GET CERTIFICATION BY ID
const getCertificationById = asyncHandler(async (req, res) => {

  const { id } = req.params;


  const certification = await Certificate.findById(id);


  if (!certification) {
    throw new APiError(
      404,
      "Certification not found"
    );
  }


  return res.status(200).json(
    new ApiResponse(
      200,
      certification,
      "Certification fetched successfully"
    )
  );
});


// UPDATE CERTIFICATION
const updateCertification = asyncHandler(async (req, res) => {

  const { id } = req.params;

  const {
    title,
    issuer,
    issueDate,
    credentialId,
    credentialUrl,
    certificateUrl
  } = req.body;


  if (
    !title ||
    !issuer ||
    !issueDate
  ) {
    throw new APiError(
      400,
      "Title, issuer and issue date are required"
    );
  }


  const updatedCertification =
    await Certificate.findByIdAndUpdate(
      id,
      {
        title,
        issuer,
        issueDate,
        credentialId,
        credentialUrl,
        certificateUrl
      },
      {
        new: true,
        runValidators: true
      }
    );


  if (!updatedCertification) {
    throw new APiError(
      404,
      "Certification not found"
    );
  }


  return res.status(200).json(
    new ApiResponse(
      200,
      updatedCertification,
      "Certification updated successfully"
    )
  );
});


// DELETE CERTIFICATION
const deleteCertification = asyncHandler(async (req, res) => {

  const { id } = req.params;


  const deletedCertification =
    await Certificate.findByIdAndDelete(id);


  if (!deletedCertification) {
    throw new APiError(
      404,
      "Certification not found"
    );
  }


  return res.status(200).json(
    new ApiResponse(
      200,
      deletedCertification,
      "Certification deleted successfully"
    )
  );
});


export {
  createCertification,
  getAllCertifications,
  getCertificationById,
  updateCertification,
  deleteCertification
};