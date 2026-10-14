import { Router } from "express";

import {
  createCertification,
  getAllCertifications,
  getCertificationById,
  updateCertification,
  deleteCertification
} from "../controllers/certification.controllers.js";

import verifyJWT from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const router = Router();


router.post("/", verifyJWT,upload.single("certificate"), createCertification);
router.get("/", getAllCertifications);
router.get("/:id", getCertificationById);
router.put("/:id", verifyJWT,upload.single("certificate"), updateCertification);
router.delete("/:id", verifyJWT, deleteCertification);

export default router;