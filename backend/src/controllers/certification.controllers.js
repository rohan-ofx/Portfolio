import APiError from "../utils/ApiErrors.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asynchandler.js";
import { Certificate } from "../models/certificate.model.js";
import uploadToCloudinary from "../utils/cloudinaryUpload.js";

// CREATE CERTIFICATION
const createCertification = asyncHandler(async (req, res) => {
  const {
    title,
    issuer,
    issueDate,
    credentialId,
    credentialUrl,
    description,
  } = req.body;

  // Validate required fields
  if (
    !title?.trim() ||
    !issuer?.trim() ||
    !issueDate
  ) {
    throw new APiError(
      400,
      "Title, issuer and issue date are required"
    );
  }

  // Upload certificate image if provided
  let certificateImageUrl = "";

  if (req.file) {
    certificateImageUrl = await uploadToCloudinary(
      req.file.buffer,
      "portfolio/certificates"
    );
  }

  // Create certificate in MongoDB
  const certification = await Certificate.create({
    title: title.trim(),
    issuer: issuer.trim(),
    issueDate,
    credentialId: credentialId?.trim() || "",
    credentialUrl: credentialUrl?.trim() || "",
    description: description?.trim() || "",
    certificateUrl: certificateImageUrl,
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
    throw new APiError(404, "Certification not found");
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
    description,
  } = req.body;

  // Validate required fields
  if (
    !title?.trim() ||
    !issuer?.trim() ||
    !issueDate
  ) {
    throw new APiError(
      400,
      "Title, issuer and issue date are required"
    );
  }

  // Find existing certificate
  const existingCertification = await Certificate.findById(id);

  if (!existingCertification) {
    throw new APiError(404, "Certification not found");
  }

  // Preserve old image unless a new image is uploaded
  let certificateImageUrl =
    existingCertification.certificateUrl || "";

  if (req.file) {
    certificateImageUrl = await uploadToCloudinary(
      req.file.buffer,
      "portfolio/certificates"
    );
  }

  // Update certificate
  const updatedCertification = await Certificate.findByIdAndUpdate(
    id,
    {
      title: title.trim(),
      issuer: issuer.trim(),
      issueDate,
      credentialId: credentialId?.trim() || "",
      credentialUrl: credentialUrl?.trim() || "",
      description: description?.trim() || "",
      certificateUrl: certificateImageUrl,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedCertification) {
    throw new APiError(404, "Certification not found");
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

  const deletedCertification = await Certificate.findByIdAndDelete(id);

  if (!deletedCertification) {
    throw new APiError(404, "Certification not found");
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
  deleteCertification,
};