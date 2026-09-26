import { Router } from "express";
import {registerUser , loginuser} from "../controllers/user.controllers.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login" , loginuser);

export default router;