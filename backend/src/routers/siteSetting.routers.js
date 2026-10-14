import { Router } from "express";

import {
  createSiteSettings,
  getSiteSettings,
  updateSiteSettings,
  deleteSiteSettings,
  updateProfileImage
} from "../controllers/siteSettings.controllers.js";
import resumeUpload from "../middlewares/resumeUpload.middleware.js";
import verifyJWT from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const router = Router();

// Public route
router.get("/", getSiteSettings);

// Protected routes

router.patch(
  "/profile-image",
  verifyJWT,
  upload.single("profileImage"),
  updateProfileImage
);
router.post("/", verifyJWT,resumeUpload.single("resume"), createSiteSettings);

router.put("/", verifyJWT, resumeUpload.single("resume"), updateSiteSettings);

router.delete("/", verifyJWT, deleteSiteSettings);

export default router;