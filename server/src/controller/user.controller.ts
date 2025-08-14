import { User } from '../models/user.model.ts';
import { handler } from '../utils/handler.ts';
import { ApiErr } from '../utils/apiErr.ts';
import { ApiRes } from '../utils/apiRes.ts';
import { fxnCall } from '../types.ts';
import { Request, Response, NextFunction } from 'express';
import { Chat } from '../models/chat.model.ts';
import mongoose from 'mongoose';
import { OAuth2Client } from 'google-auth-library';
import { pipeline } from 'stream';
import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs/promises';
import {cloudinaryConfig } from "../app.ts"

export const generateToken = async (id: any) => {
  try {
    const user = await User.findById(id);
    if (!user) throw new ApiErr(404, 'User not found');
    const refreshToken = await user.generateRefreshToken();
    const accessToken = await user.generateAccessToken();
    user.refreshToken = refreshToken;
    user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (err) {
    throw new ApiErr(500, 'error while generating tokens.');
  }
};

export const userRegistration = handler(async ({ req, res, next }: fxnCall) => {
  const { userName, email, password } = req.body;
  const files = req.file;
  console.log(files);
  

  if (
    [userName, email, password].some((field) => {
      return field === undefined || field.trim() === '';
    })
  ) {
    return next(new ApiErr(400, 'All fields are required!'));
  }

  if (!email.includes('@')) {
    return next(new ApiErr(400, 'Email format is not correct.'));
  }

  const existingUser = await User.findOne({
    $or: [{ userName }, { email }]
  });

  if (existingUser) {
    return next(new ApiErr(400, 'User already exist.'));
  }
  
  const cloudinaryImage = await cloudinary.uploader.upload(files?.path as string,{folder:'chat-app'});
  await fs.unlink((files as any).path);

  const newUser = await User.create({
    userName,
    email,
    password,
    avatar: cloudinaryImage.secure_url
  });
  const user = await User.findById(newUser._id)?.select('-password -refreshToken');

  if (!user) {
    return next(new ApiErr(400, 'User not created'));
  }

  return res.status(200).json(ApiRes(200, 'User created Successfully', user));
});

export const userLogin = handler(async ({ req, res, next }: fxnCall) => {
  const { name, password } = req.body;
  if (!name) {
    // throw new ApiErr(400, "Invalid, credentials not provided");
    return next(new ApiErr(400, 'Invalid, credentials not provided'));
  }
  if (!password) {
    return next(new ApiErr(400, 'password is required'));
    throw new ApiErr(400, 'password is required');
  }

  let query: any = {};
  if (name.includes('@')) {
    query.email = name;
  } else {
    query.userName = name;
  }

  let user = await User.findOne(query);
  if (!user) {
    // throw new ApiErr(400, "User not found.")
    return next(new ApiErr(400, 'User not found.'));
  }

  const verifyPassword = await user.checkPassword(password);
  if (!verifyPassword) {
    // throw new ApiErr(400, "Invalid password");
    return next(new ApiErr(400, 'Invalid password'));
  }

  const { accessToken, refreshToken } = await generateToken(user._id);

  console.log(accessToken, refreshToken);
  user = (await User.findById(user._id).select('-password -refreshToken')) as any;

  const options = {
    httpOnly: true,
    Secure: false
  };
  return res
    .status(200)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', refreshToken, options)
    .json(ApiRes(200, 'user log-in successfully', user));
});

export const userLogout = handler(async ({ req, res, next }: fxnCall) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined
      }
    },
    { new: true }
  );

  const options: {
    httpOnly: boolean;
    secure: boolean;
  } = {
    httpOnly: true,
    secure: true
  };
  return res
    .status(200)
    .clearCookie('refreshToken', options)
    .clearCookie('accessToken', options)
    .json(ApiRes(200, 'user log-out successfully'));
});

export const getUser = handler(async ({ req, res, next }: fxnCall) => {
  const { search } = req.query;
  const loggedInUserName = req.user.userName;
  if (!search) {
    throw new ApiErr(400, 'search query is required.');
  }

  let user = await User.find({
    userName: {
      $regex: search,
      $options: 'i' //Case senstive
    }
  });

  if (!user) {
    throw new ApiErr(404, 'user not found.');
  }

  const n = user.filter((u) => {
    return u.userName !== loggedInUserName;
  });

  return res.status(200).json(ApiRes(200, 'User Found', n));
});

export const getFriends = handler(async ({ req, res, next }: fxnCall) => {
  const friends = await Chat.aggregate([
    {
      $match: {
        $and: [
          // { isGroup: false },
          {
            participants: {
              $in: [new mongoose.Types.ObjectId(req.user._id)]
            }
          }
        ]
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'participants',
        foreignField: '_id',
        as: 'participants',
        pipeline: [
          {
            $project: {
              userName: 1,
              _id: 1,
              socketId: 1,
              lastOnline:1,
              email:1,
              description:1,
              avatar:1
            }
          }
        ]
      }
    },
    {
      $set: {
        participants: {
          $filter: {
            input: '$participants',
            as: 'participant',
            cond: {
              $ne: ['$$participant._id', new mongoose.Types.ObjectId(req.user._id)]
            }
          }
        }
      }
    },
    {
      $lookup: {
        from: 'messages',
        localField: '_id',
        foreignField: 'chat',
        as: 'lastMessage',
        pipeline: [
          {
            $lookup: {
              from: 'users',
              localField: 'sender',
              foreignField: '_id',
              as: 'sender'
            }
          },
          {
            $unwind: {
              path: '$sender'
            }
          },
          {
            $project: {
              message: 1,
              sender: '$sender.userName',
              createdAt: 1
            }
          },
          {
            $sort: {
              createdAt: -1
            }
          },
          {
            $limit: 1
          }
        ]
      }
    },{
  $unwind: {
    path: '$lastMessage',
    preserveNullAndEmptyArrays: true
  }
}
  ]);

  return res.status(200).json(ApiRes(200, 'friends list', friends));
});

export const getCurrentUser = handler(async ({ req, res, next }: fxnCall) => {
  let user = req.user;
  if (!user) return next(new ApiErr(400, 'Need to login in.'));
  delete user.password;
  return res.status(200).json(ApiRes(200, 'User fetched successfully', user));
});

export const updateUser = handler(async ({ req, res, next }: fxnCall) => {
  const user = req.user;
  const data = req.body;
  const files = req.file;
  console.log(files);
  

  const updatedUser = await User.findByIdAndUpdate(
    {
      _id: user._id
    },
    data,
    { new: true }
  );

  return res.status(200).json(ApiRes(200, 'User updated successfullly', updatedUser));
});

export const checkUniqueUserName = handler(async ({ req, res, next }: fxnCall) => {
  const { userName } = req.body;
  const existingUserWithSameName = await User.findOne({ userName });

  if (existingUserWithSameName) return next(new ApiErr(400, 'User with same name already exist.'));
  return res.status(200).json(ApiRes(200, 'User name avaliable.'));
});

export const googleSignUp = handler(async ({ req, res, next }: fxnCall) => {
  const d = req.body;
  const profileRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: {
      Authorization: `Bearer ${d.access_token}`
    }
  });

  const profileData = await profileRes.json();

  if (!profileRes.ok) {
    return next(new ApiErr(400, profileData));
  }
  console.log('profileData : ', profileData);

  const { name, email, sub, picture } = profileData;
  let user = await User.findOne({
    googleUserId: sub
  });

  const options = {
    httpOnly: true,
    Secure: false
  };

  if (user) {
    const { accessToken, refreshToken } = await generateToken((user as mongoose.Document<unknown>)._id);
    return res
      .status(200)
      .cookie('accessToken', accessToken, options)
      .cookie('refreshToken', refreshToken, options)
      .json(ApiRes(200, 'User account alreadt exists', user));
  }

  user = await User.create({
    userName: name,
    email,
    avatar: picture,
    googleUserId: sub,
    password: sub
  });

  if (!user) return next(new ApiErr(400, 'Error while registering user'));
  const { accessToken, refreshToken } = await generateToken(user._id);

  const newUser = await User.findById(user._id);
  if (!newUser) return next(new ApiErr(400, 'Error while fetching user details'));

  console.log('new user : ', newUser);
  return res
    .status(200)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', refreshToken, options)
    .json(ApiRes(200, 'Account created successfully', newUser));
});
