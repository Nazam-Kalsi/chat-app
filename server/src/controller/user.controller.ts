import { User } from "../models/user.model.ts";
import { handler } from "../utils/handler.ts";
import { ApiErr } from "../utils/apiErr.ts";
import { ApiRes } from "../utils/apiRes.ts";
import { fxnCall } from "../types.ts";
import { Request, Response, NextFunction } from "express";
import { Chat } from "../models/chat.model.ts";
import mongoose from "mongoose";


export const generateToken = async (id: any) => {
  try {
    const user = await User.findById(id);
    if (!user) throw new ApiErr(404, "User not found");
    const refreshToken = await user.generateRefreshToken();
    const accessToken = await user.generateAccessToken();
    user.refreshToken = refreshToken;
    user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  }
  catch (err) {
    throw new ApiErr(500, "error while generating tokens.")
  }


}

export const userRegistration = handler(async ({ req, res, next }: fxnCall) => {
  const { userName, email, password } = req.body;
  console.log(userName, email, password);

  if (
    [userName, email, password].some((field) => {
      return field === undefined || field.trim() === "";
    })
  ) {
    throw new ApiErr(400, "All fields are required!");
  }

  if (!email.includes("@")) {
    throw new ApiErr(400, "Email format is not correct.");
  }

  const existingUser = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (existingUser) {
    console.log(existingUser);
    throw new ApiErr(400, "User already exist.");
  }

  const newUser = await User.create({
    userName,
    email,
    password,
  });
  const user = await User.findById(newUser._id)?.select(
    "-password -refreshToken"
  );

  if (!user) {
    throw new ApiErr(400, "User not created");
  }

  return res.status(200).json(ApiRes(200, 'User created Successfully', user))
});

export const userLogin = handler(async ({ req, res, next }: fxnCall) => {
  const { userName, email, password } = req.body;
  if (!userName && !email) {
    throw new ApiErr(400, "Invalid credentials not provided");
  }
  if (!password) {
    throw new ApiErr(400, "password is required");
  }

  let user = await User.findOne({
    $or: [
      { userName }, { email }
    ]
  })
  if (!user) {
    return new ApiErr(400, "User not found.")
  }

  const verifyPassword = await user.checkPassword(password);
  if (!verifyPassword) {
    throw new ApiErr(400, "Invalid password");
  }


  const { accessToken, refreshToken } = await generateToken(user._id);

  user = await User.findById(user._id).select("-password -refreshToken") as any

  const options = {
    httpOnly:true,
    Secure:true
  }
  return res
    .status(200)
    .cookie("accessToken", accessToken,options)
    .cookie("refreshToken", refreshToken,options)
    .json(ApiRes(200, "user log-in successfully", user));
});

export const userLogout = handler(async ({ req, res, next }: fxnCall) => {
  await User.findByIdAndUpdate(
    req.user._id, {
    $set: {
      refreshToken: undefined
    }
  },
    { new: true }
  );

  const options: {
    httpOnly: boolean,
    secure: boolean
  } = {
    httpOnly: true,
    secure: true,
  }
  return res
    .status(200)
    .clearCookie("refreshToken", options)
    .clearCookie("accessToken", options)
    .json(ApiRes(200, "user log-out successfully"));
});

export const getUser = handler(async({req,res,next}:fxnCall)=>{
  const {search} =req.query;
  if(!search){
    throw new ApiErr(400,"search query is required.")
  }

  const user = User.find({
    userName:{
      $regex:search,
      $options:"i"
    }
  })

  if(!user){
    throw new ApiErr(404,"user not found.")
  }
  return res.status(200)
  .json(ApiRes(200,"User Found",user));
})

export const getFriends = handler(async ({ req, res, next }: fxnCall) => {


  const friends = await Chat.aggregate([
    {
      $match: {
        $and: [
          { isGroup: false },
          {
            participants: {
              $in: [new mongoose.Types.ObjectId(req.user._id)]
            }
          }
        ]
      }
    }
  ])

  // const friends=user.friends;
  return res
    .status(200)
    .json(ApiRes(200, "friends list", friends));
})

