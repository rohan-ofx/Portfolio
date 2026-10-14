import { Router } from "express";
import  {createProject , getAllProjects ,getProjectById , deleteProject, updateProject} from "../controllers/project.controllers.js";
import verifyJWT from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const router = Router();

router.post("/" , verifyJWT, upload.single("image"), createProject);
router.get("/" , getAllProjects);
router.get("/:id", getProjectById);
router.delete("/:id", verifyJWT , deleteProject);
router.put("/:id", verifyJWT, upload.single("image") , updateProject);

export default router;