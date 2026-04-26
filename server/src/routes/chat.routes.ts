import { Router } from "express";
import { ChatController } from "../controller/chat.controller.js";

const router = Router();

/**
 * @route POST /api/chat
 * @desc Chat with AI assistant for housing support
 * @access Public (no authentication required for chat)
 */
router.post("/chat", ChatController.chatWithAI);

export default router;
