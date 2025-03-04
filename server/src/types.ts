import { Request, Response, NextFunction } from "express";

export interface fxnCall{
    res:Response;
    req:Request;
    next:NextFunction;
}