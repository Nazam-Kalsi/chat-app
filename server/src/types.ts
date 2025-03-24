import { Request, Response, NextFunction } from "express";

export interface fxnCall{
    res:Response;
    req:Request;
    next:NextFunction;
}

declare module 'Express' {
    interface Request {
        user?:any
    }
}

declare module "socket.io" {
    interface Socket {
      userName?: string;
    }
  }