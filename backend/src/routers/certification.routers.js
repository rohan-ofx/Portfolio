import { Router } from "express";

import {
  createCertification,
  getAllCertifications,
  getCertificationById,
  updateCertification,
  deleteCertification
} from "../controllers/certification.controllers.js";

import verifyJWT from "../middlewares/auth.middleware.js";

const router = Router();


router.post("/", verifyJWT, createCertification);
router.get("/", getAllCertifications);
router.get("/:id", getCertificationById);
router.put("/:id", verifyJWT, updateCertification);
router.delete("/:id", verifyJWT, deleteCertification);

export default router;