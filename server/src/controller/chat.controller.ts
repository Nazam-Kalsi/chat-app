import { ApiErr } from "../utils/apiErr";
import { ApiRes } from "../utils/apiRes";
import { handler } from "../utils/handler";
import { User } from "../models/user.model";
import { Chat } from "../models/chat.model";
import { fxnCall } from "../types";
import mongoose from "mongoose";

export const createOrGetChat = handler(async ({ req, res, next }: fxnCall) => {
  const { reqID } = req.params;

  const reciever = await User.findById(reqID);
  if (!reciever) {
    throw new ApiErr(400, "user not existed");
  }

  const ExistingChat = await Chat.aggregate([
    {
      $match: {
        isGroup: false,
      },
      $and: [
        {
          participants: { $elemMatch: { $eq: req.user._id } },
        },
        {
          participants: { $eleMatch: { $eq: reqID } },
        },
      ],
    },
    {
      $lookUp: {
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

  if (ExistingChat) {
    return res
      .status(200)
      .json(new ApiRes(200, "chat fetched successfully", ExistingChat));
  }

  const newChat = await Chat.create({
    name: "one-on-one-chat",
    participants: [req.user._id, new mongoose.Types.ObjectId(reqID)],
    admin: req.user_id,
  });

  const chat = await Chat.findOne({ _id: newChat._id }).populate(
    "users",
    "-password"
  );

  if (!chat) return new ApiErr(400, "error while creating chat");

  return res
    .status(200)
    .json(new ApiRes(200, "Chat created successfully", chat));
});

export const getUserChats = handler(async ({ req, res, next }: fxnCall) => {
  const id = req.user._id;
  const chats = await Chat.find({
    participants: { $eleMatch: { $eq: id } },
  }).populate("participants", "-password");

  // if(!chats.length){
  //     throw new ApiErr(400,"no previous chats")
  // }

  return res
    .status(200)
    .json(new ApiRes(200, "chats fetched successfully", chats || []));
});

export const createOrGetGroupChat = handler(async ({ req, res, next }: fxnCall) => {
    const { name, users }: { name: string; users: Array<any> } = req.body;

    if (!name) throw new ApiErr(400, "group name required");
    if (!users.length)
      throw new ApiErr(400, "group members are required for group creation");

    const existingGroup = await Chat.find({
      name: name,
      isGroup: true,
      participants: { $all: [users] },
    });

    if (existingGroup) {
      return res
        .status(200)
        .json(new ApiRes(200, "group found", existingGroup));
    }

    let group = await Chat.create({
      isGroup: true,
      participants: users,
      name: name,
      admin: req.user._id,
    });

    group = await Chat.aggregate([
      {
        $match: {
          _id: group._id,
        },
      },
      {
        lookup: {
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
    ]);

    if (!group) throw new ApiErr(400, "error while creating group");

    return res
      .status(200)
      .json(new ApiRes(200, "group created successfully", group[0]));
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
    .json(new ApiRes(200, "group name changed successfully", group[0]));
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
    .json(new ApiRes(200, "menber added successfully", group));
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
    .json(new ApiRes(200, "menber remove successfully", group));
});
