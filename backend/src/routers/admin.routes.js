import {Router} from "express";

import { getDashboardStatus} from "../controllers/admin.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";

const router= Router();

router.get("/dashboard" ,verifyJWT , getDashboardStatus);

export default router;