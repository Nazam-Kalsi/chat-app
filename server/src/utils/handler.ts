// export const handler=(fxn:any)=>{
//     return ({req,res,next}:{req:any,res:any,next:any})=>{
//         Promise.resolve(fxn(req,res,next))
//         .catch((err)=>next(err))
//     }
// } 
import { fxnCall } from "../types.ts";
import { Request, Response, NextFunction } from "express";

export const handler = (fxn: ({req, res, next}:fxnCall) => Promise<any>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fxn({req, res, next})).catch(next);
    };
};