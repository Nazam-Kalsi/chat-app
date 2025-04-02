import { ApiErr } from "../utils/apiErr.ts";
import { ApiRes } from "../utils/apiRes.ts";
import { handler } from "../utils/handler.ts";
import { User } from "../models/user.model.ts";
import { Chat } from "../models/chat.model.ts";
import { fxnCall } from "../types.ts";
import mongoose from "mongoose";

export const createChat = handler(async ({ req, res, next }: fxnCall) => {
  const { friendId } = req.params;
  const reciever = await User.findById(friendId);
  if (!reciever) {
    throw new ApiErr(400, "user not existed");
  }

  const ExistingChat = await Chat.aggregate([
    {
      $match: {
        isGroup: false,
        $and: [
          {
            participants: { $in: [req.user._id] },
          },
          {
            participants: { $in: [reciever._id] },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "participants",
        foreignField: "_id",
        as: "participants",
        pipeline: [
          {
            $project: {
              _id: 1,
              userName: 1,
              email: 1,
            },
          },
        ],
      },
    },
  ]);

  console.log("ExistingChat : ",ExistingChat);

  if (ExistingChat.length) {
    // return res
    //   .status(200)
    //   .json(ApiRes(200, "Chat already exist.", ExistingChat));
        return next(new ApiErr(400, "Chat already exist"));
    
  }

  const newChat = await Chat.create({
    name: "one-on-one-chat",
    participants: [req.user._id, new mongoose.Types.ObjectId(friendId)],
    admin: req.user.user_id,
  });

  const chat = await Chat.findOne({ _id: newChat._id }).populate(
    "participants",
    "-password"
  );

  if (!chat) return new ApiErr(400, "error while creating chat");

  return res
    .status(200)
    .json(ApiRes(200, "Chat created successfully", chat));
});

export const getChats = handler(async ({ req, res, next }: fxnCall) => {
  const id = req.user._id;
  const chats = await Chat.find({
    // participants: { $eleMatch: { $eq: id } },
    participants: { $in: [id] }
  }).populate("participants");

  // if(!chats.length){
  //     throw new ApiErr(400,"no previous chats")
  // }

  return res
    .status(200)
    .json(ApiRes(200, "chats fetched successfully", chats || []));
});

export const createOrGetGroupChat = handler(async ({ req, res, next }: fxnCall) => {
    const { name, users }: { name: string; users: Array<any> } = req.body;

    if (!name) throw new ApiErr(400, "group name required");
    if (!users.length)
      throw new ApiErr(400, "group members are required for group creation");

    const userIds = users.map((id)=>{
      return new mongoose.Types.ObjectId(id);
    })

    userIds.push(new mongoose.Types.ObjectId(req.user._id));

    console.log(userIds);
    

    const existingGroup = await Chat.find({
      name: name,
      isGroup: true,
      participants: { $all: userIds },
    }).populate('participants');

    if (existingGroup.length) {
      return res
        .status(200)
        .json(ApiRes(200, "group found", existingGroup));
    }

    let group = await Chat.create({
      isGroup: true,
      participants: userIds,
      name: name,
      admin: req.user._id,
    });

    const groupAggregationResult = await Chat.aggregate([
      {
        $match: {
          _id: group._id,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "participants",
          foreignField: "_id",
          as: "participants",
          pipeline: [
            {
              $project: {
                _id: 1,
                userName: 1,
              },
            },
          ],
        },
      },
    ]);

    group = groupAggregationResult[0];
    if (!group) throw new ApiErr(400, "error while creating group");

    return res
      .status(200)
      .json( ApiRes(200, "group created successfully", group));
  }
);

export const changeGroupName = handler(async ({ res, req, next }: fxnCall) => {
  const { name, id } = req.body;
  if (!name) throw new ApiErr(400, "group name is required");

  const updatedGroup = await Chat.findByIdAndUpdate(
    id,
    {
      $set: {
        name,
      },
    },
    { new: true }
  );
if(!updatedGroup) throw new ApiErr(500, "error while changing group name");
  const group = await Chat.aggregate([
    {
      $match: {
        _id: updatedGroup._id,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "participants",
        foreignField: "_id",
        as: "participants",
        pipeline: [
          {
            $project: {
              _id: 1,
              username: 1,
              email: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "admin",
        foreignField: "_id",
        as: "admin",
        pipeline: [
          {
            $project: {
              _id: 1,
              username: 1,
              email: 1,
            },
          },
        ],
      },
    },
  ]);

  if (!group[0]) throw new ApiErr(500, "error while changing group name");

  return res
    .status(200)
    .json(ApiRes(200, "group name changed successfully", group[0]));
});

export const addToGroupChat = handler(async ({ res, req, next }: fxnCall) => {
  const { groupId, userId } = req.body;
  if (!userId) throw new ApiErr(400, "user is not provided");

  let group = await Chat.findById(groupId);

  if (!group) throw new ApiErr(400, "group not find");

  group = await Chat.findByIdAndUpdate(
    group._id,
    {
      $push: {
        participants: userId,
      },
    },
    {
      new: true,
    }
  )
    .populate("participants", "-password")
    .populate("admin", "-password");

  if (!group)
    throw new ApiErr(500, "server-side error while adding member to group");

  return res
    .status(200)
    .json(ApiRes(200, "menber added successfully", group));
});

export const removeFromGroup = handler(async ({ req, res, next }: fxnCall) => {
  const { groupId, userId } = req.body;
  if (!userId) throw new ApiErr(400, "user is not provided");

  let group = await Chat.findById(groupId);

  if (!group) throw new ApiErr(400, "group not find");

  group = await Chat.findByIdAndUpdate(
    group._id,
    {
      $pull: {
        participants: userId,
      },
    },
    {
      new: true,
    }
  )
    .populate("participants", "-password")
    .populate("admin", "-password");

  if (!group)
    throw new ApiErr(500, "server-side error while removing member to group");

  return res
    .status(200)
    .json(ApiRes(200, "menber remove successfully", group));
});

export const updateGroupDetails = handler(async ({ req, res, next }: fxnCall) => {
  const data = req.body;
  const user = req.user;
  console.log(data);
  const group = await Chat.findById({_id:data.id}); 
  if(!group){
    return next(new ApiErr(400,"Not found"));
  }
  if(user._id!==group.admin){
    return next(new ApiErr(400,"You are not the admin"))
  }
  
  const groupChat =await Chat.findByIdAndUpdate({
    _id:data.id
  },{
      name:data.name,
      participants:[...data.users, user._id],

  },{new:true}
);

return res.status(200).json(ApiRes(200,"Group info updated successfully",groupChat));
});
