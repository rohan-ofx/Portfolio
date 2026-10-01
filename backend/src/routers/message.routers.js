import { Router } from "express";

import {
  createMessage,
  getAllMessages,
  getMessageById,
  updateMessageReadStatus,
  deleteMessage
} from "../controllers/message.controllers.js";

import verifyJWT from "../middlewares/auth.middleware.js";

const router = Router();

// Public route - anyone can send a message
router.post("/", createMessage);

// Protected routes - JWT required
router.get("/", verifyJWT, getAllMessages);

router.get("/:id", verifyJWT, getMessageById);

router.patch("/:id/read", verifyJWT, updateMessageReadStatus);

router.delete("/:id", verifyJWT, deleteMessage);

export default router;