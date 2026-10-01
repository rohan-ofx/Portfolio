import { Router } from "express";

import {
  createCodingProfile,
  getAllCodingProfiles,
  getCodingProfileById,
  updateCodingProfile,
  deleteCodingProfile
} from "../controllers/codingProfile.controllers.js";

import verifyJWT from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", verifyJWT, createCodingProfile);

router.get("/", getAllCodingProfiles);

router.get("/:id", getCodingProfileById);

router.put("/:id", verifyJWT, updateCodingProfile);

router.delete("/:id", verifyJWT, deleteCodingProfile);

export default router;