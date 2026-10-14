import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import {registerUser , loginuser,refreshAccessToken,logoutUser} from "../controllers/user.controllers.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login" , loginuser);
router.post("/refresh-token", refreshAccessToken)
router.post("/logout", verifyJWT , logoutUser);

export default router;