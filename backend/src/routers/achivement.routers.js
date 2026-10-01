import { Router } from "express";

import {
  createAchievement,
  getAllAchievements,
  getAchievementById,
  updateAchievement,
  deleteAchievement
} from "../controllers/achievement.controllers.js";

import verifyJWT from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", verifyJWT, createAchievement);

router.get("/", getAllAchievements);

router.get("/:id", getAchievementById);

router.put("/:id", verifyJWT, updateAchievement);

router.delete("/:id", verifyJWT, deleteAchievement);

export default router;