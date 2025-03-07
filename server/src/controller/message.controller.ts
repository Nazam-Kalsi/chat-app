import { ApiErr } from "../utils/apiErr.ts";
import { ApiRes } from "../utils/apiRes.ts";
import { handler } from "../utils/handler.ts";
import { fxnCall } from "../types.ts";
import { Message } from "../models/message.model.ts";
import { User } from "../models/user.model.ts";
import { Chat } from "../models/chat.model.ts";
import mongoose from "mongoose";

export const sendMessageInChat = handler(async ({ req, res, next }: fxnCall) => {
    const { chatID } = req.params;
    const messageContent = req.body;
    const senderID = req.user;
    if (!senderID) throw new ApiErr(400, "User is'nt authenticated.")
    if (!messageContent) throw new ApiErr(400, `Message content is of 0 length or message is'nt provided`);
    const chat = await Chat.findById(chatID);
    if (!chat) throw new ApiErr(400, "Chat not found.");

    const newMessage = await Message.create(
        {
            message: messageContent,
            sender: senderID,
            chat: chatID
        }
    );

    if(!newMessage)throw new ApiErr(400,"Error while sending message");

    const returningMessge = await Message.aggregate([
        {
            $match:{
                _id:new mongoose.Types.ObjectId(newMessage._id)
            }
        },{
            $lookup:{
                from:'chats',
                localField:'chat',
                foreignField:'_id',
                as:'chat',                
            }
        }       
    ]);

    if(!returningMessge)throw new ApiErr(400,"error while returing message, please try again later.");

    return res.status(200)
    .json(ApiRes(200,"Message sent successfully",returningMessge));
})

export const deleteMessageInChat = handler(async ({ req, res, next }: fxnCall) => {
    const { msgID } = req.body;
    if(!msgID)return new ApiErr(400,"No message selected to delete");

    const deleting = await Message.findByIdAndDelete(msgID);

    if(!deleting) throw new ApiErr(400, "error while deleting message, try again later.")

    res.status(200)
    .json(ApiRes(200,"Message deleted successfully."));
})