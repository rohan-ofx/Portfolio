import { Router } from "express";
import { createExperience ,getAllExperiences,getExperienceById , updateExperience ,deleteExperience } from "../controllers/experience.controllers.js";
import verifyJWT from "../middlewares/auth.middleware.js";

const router = Router();


router.post("/", verifyJWT ,createExperience);
router.get("/",getAllExperiences);
router.get("/:id",getExperienceById);
router.put("/:id",verifyJWT , updateExperience);
router.delete("/:id",verifyJWT,deleteExperience);

export default router;