import { Router } from "express";

import {
  createSiteSettings,
  getSiteSettings,
  updateSiteSettings,
  deleteSiteSettings
} from "../controllers/siteSettings.controllers.js";

import verifyJWT from "../middlewares/auth.middleware.js";

const router = Router();

// Public route
router.get("/", getSiteSettings);

// Protected routes
router.post("/", verifyJWT, createSiteSettings);

router.put("/", verifyJWT, updateSiteSettings);

router.delete("/", verifyJWT, deleteSiteSettings);

export default router;