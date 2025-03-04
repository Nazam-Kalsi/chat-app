import { User } from "../models/user.model.ts";
import { handler } from "../utils/handler.ts";
import { ApiErr } from "../utils/apiErr.ts";
import { ApiRes } from "../utils/apiRes.ts";
import { fxnCall } from "../types.ts";
import { Request, Response, NextFunction } from "express";



export const generateToken=async(id:any)=>{
    try{
        const user=await User.findById(id);
        if(!user) throw new ApiErr(404, "User not found");
        const refreshToken=await user.generateRefreshToken();
        const accessToken=await user.generateAccessToken();
        user.refreshToken=refreshToken;
        user.save({validateBeforeSave:false});
        return {accessToken, refreshToken};
    }
    catch(err){
        throw new ApiErr(500,"error while generating tokens.")
    }


}
// export const userRegistration = handler(async (req: Request, res: Response, next: NextFunction) => {
//   console.log(req.body);
//   const user = { id: 1, email: req.body.email };
//   return res.status(201).json(new ApiRes(201, "User registered successfully", user));
// });

export const userRegistration = handler(async ( {req, res, next}:fxnCall ) => {
  const { userName, email, password } = req.body;
  console.log(userName, email, password);

  if (
    [userName, email, password].some((field) => {
      return field.trim() === "";
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

  return res
    .status(200)
    .json(new ApiRes(200, "User created Successfully", user));
});

export const userLogin = handler(async ( {req, res, next} : fxnCall ) => {
    const {userName,email,password}=req.body;
        if(!userName && !email){
            throw new ApiErr(400,"Invalid credentials");
        }
        if(!password){
            throw new ApiErr(400,"password is required");
        }

        let user=await User.findOne({
            $or:[
                {userName},{email}
            ]
        })
        if(!user){
            throw new ApiErr(400,"User not found.")
        }

        const verifyPassword=await user.checkPassword(password);
        if(!verifyPassword){
            throw new ApiErr(400,"Invalid password");
        }

        const {accessToken,refreshToken}=await generateToken(user._id);

        user=await User.findById(user._id).select("-password -refreshToken") as any

        const options={
            httpOnly:true,
            Secure:true
        }

        return res
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",refreshToken,options)
        .status(200)
        // .json(new ApiRes(200,"user log-in successfully",user));
});

// export const userLogout=handler(async({req,res,next}:fxnCall)=>{
//     await User.findByIdAndUpdate(
//         req.user._id,{
//             $set:{
//                 refreshToken:undefined
//             }
//         },
//         {new:true}
//     );
    
//     const options:{
//         httpOnly:boolean,
//         secure:boolean
//     }={
//         httpOnly:true,
//         secure:true,
//     }
//     return res
//     .status(200)
//     .clearCookie("refreshToken",options)
//     .clearCookie("accessToken",options)
//     .json(200,"user log-out successfully")
// });

// export const getFriends=handler(async({req,res,next}:fxnCall)=>{
//   const user=req.user;
//   const friends=user.friends;
//   return res.json(new ApiRes(200,"friends list",friends));
// })

