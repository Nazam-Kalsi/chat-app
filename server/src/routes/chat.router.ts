import { Router } from "express";
import { verifyToken } from "../middleware/auth.middleware.ts";
import { addToGroupChat, changeGroupName, createChat, createOrGetGroupChat, getChats, removeFromGroup } from "../controller/chat.controller.ts";

const router = Router();


router.route(`/create-chat`).post(verifyToken,createChat);
router.route(`/get-chat`).get(verifyToken,getChats);
router.route(`/create-group-chat`).get(verifyToken,createOrGetGroupChat);
router.route(`/change-group-chat-name`).post(verifyToken,changeGroupName);
router.route(`/add-to-group-chat`).post(verifyToken,addToGroupChat);
router.route(`/remove-from-group-chat`).post(verifyToken,removeFromGroup);
export default router;