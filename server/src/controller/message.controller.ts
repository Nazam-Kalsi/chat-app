import { ApiErr } from "../utils/apiErr.ts";
import { ApiRes } from "../utils/apiRes.ts";
import { handler } from "../utils/handler.ts";
import { fxnCall } from "../types.ts";
import { Message } from "../models/message.model.ts";
import { User } from "../models/user.model.ts";
import { Chat } from "../models/chat.model.ts";
import mongoose from "mongoose";
import { room } from "../utils/joinRoom.ts";
import { pipeline } from "stream";

export const sendMessageInChat = handler(async ({ req, res, next }: fxnCall) => {
    const { chatID } = req.params;
    const {messageContent} = req.body;
    const senderID = req.user;
    if (!senderID) throw new ApiErr(400, "User isn't authenticated.")
    if (!messageContent) throw new ApiErr(400, `Message content is of 0 length or message isn't provided`);
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

export const getMessages = handler(async({req,res,next}:fxnCall)=>{
    const {page,limit} = req.query;
    console.log("page,limit : ",page,limit)
    const {chatId} = req.body;
    const messages = await Message.aggregate([
        {
            $match:{
                chat:new mongoose.Types.ObjectId(chatId)
            }
        },
        {
            $sort:{
                createdAt:-1
            }
        },
        {
            $skip: (Number(page) - 1) * Number(limit)
          },          
          {
            $limit: Number(limit)
          },
          {
            $sort:{
                createdAt:1
            }
        },{
            $lookup:{
                from: 'users',
                foreignField: '_id',
                localField: 'sender',
                as: 'sender',
                pipeline:[
                    {
                        $project:{
                            _id:1,
                            userName:1
                        }
                    }
                ]
            }
        },{
            $unwind: {
                path: '$sender',
                preserveNullAndEmptyArrays: true
            }
        }
        //*  or
        // ,{
        //     $addFields: {
        //         sender: { $arrayElemAt: ['$sender', 0] }  // Retrieve the first item from the sender array
        //     }
        // }
        ,{
            $group:{
                _id:'$chat',
                messages: {
                    $push: {
                        message: "$message",
                        createdAt:'$createdAt',
                        sender:'$sender',
                    }
                }
            }
        }
    ]);


    if(!messages)throw new ApiErr(400,"NO message found.");

    const r= await room('create-room','r1');
    console.log(r);
    if(messages.length===0){

        return res
        .status(200)
        .json(ApiRes(200,"Messages fetched successfully",{messages:[]}));
    }
    return res
    .status(200)
    .json(ApiRes(200,"Messages fetched successfully",messages[0]));


})

export const deleteAllMessagesFromChat = handler(async ({ req, res, next }: fxnCall) => {
    const chatId:string = req.params.chatId;
    
    if(!chatId) return new ApiErr(400,"Chat id not provided");  
    console.log("chatid:",chatId)  
  const deleting = await Message.deleteMany({
    chat:new mongoose.Types.ObjectId(chatId)  
  })
  if(!deleting) return new ApiErr(400,"Not able to delete chat, please try again later.");
  return res.status(200).json(ApiRes(200,"All messages deleted successfully"));
})