import jwt,{JwtPayload} from "jsonwebtoken";
import { fxnCall } from "../types.ts";
import { ApiErr } from "../utils/apiErr.ts";
import { handler } from "../utils/handler.ts";
import { User } from "../models/user.model.ts";

interface JwtPayloadWithId extends JwtPayload{
    _id:string;
}

export const verifyToken=handler(async({req,res,next}:fxnCall)=>{
    const token=req.cookie?.accessToken
    if(!token) throw new ApiErr(401,'Unauthorized');
    if(process.env.ACCESS_TOKEN_SECRET){
        const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET) as JwtPayloadWithId;
        const user=await User.findById(decodedToken._id);
        if(!user) throw new ApiErr(401,'Unauthorized token');
        req.user=user;
        next();
    }


})