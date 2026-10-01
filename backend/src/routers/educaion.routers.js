import { Router } from "express";

import {
  createEducation,
  getAllEducation,
  getEducationById,
  updateEducation,
  deleteEducation
} from "../controllers/education.controllers.js";

import verifyJWT from "../middlewares/auth.middleware.js";

const router = Router();


router.post("/", verifyJWT, createEducation);
router.get("/", getAllEducation);
router.get("/:id", getEducationById);
router.put("/:id", verifyJWT, updateEducation);
router.delete("/:id", verifyJWT, deleteEducation);


export default router;