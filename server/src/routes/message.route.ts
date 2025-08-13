import { Router } from "express";
import { sendMessageInChat,deleteMessageInChat, getMessages,deleteAllMessagesFromChat } from "../controller/message.controller.ts";
import { verifyToken } from "../middleware/auth.middleware.ts";
const router =Router();

router.route(`/send-message/:chatID`).post(verifyToken,sendMessageInChat);
router.route(`/delete-message`).post(verifyToken,deleteMessageInChat);
router.route(`/get-messages`).post(getMessages);
router.route(`/delete-messages/:chatId`).delete(deleteAllMessagesFromChat);

export default router;
