import { Router } from "express";
import { sendMessageInChat,deleteMessageInChat } from "../controller/message.controller.ts";
import { verifyToken } from "../middleware/auth.middleware.ts";
const router =Router();

router.route(`send-message`).post(verifyToken,sendMessageInChat);
router.route(`delete-message`).post(verifyToken,deleteMessageInChat);

export default router;
