import {Router} from "express";

import { createSkill, getAllSkill, getSkillById,updateSkill,deleteSkill } from "../controllers/skills.controllers.js";
import upload from "../middlewares/upload.middleware.js";
import verifyJWT from "../middlewares/auth.middleware.js"


const router = Router();

router.post("/", verifyJWT ,upload.single("icon"), createSkill);
router.get("/",getAllSkill);
router.get("/:id" , getSkillById);
router.put("/:id" ,verifyJWT,upload.single("icon"), updateSkill);
router.delete("/:id",verifyJWT,deleteSkill);

export default router;