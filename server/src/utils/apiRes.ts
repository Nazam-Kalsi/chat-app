class ApiRes{
    statusCode:number;
    message:string;
    data?:any;
    success:boolean;
    constructor(statusCode:number,message="success",data?:any){
        this.statusCode=statusCode;
        this.message=message;
        this.data=data;
        this.success=statusCode<400;
    }
}
// import { Response } from "express";
// type resTypes = {
//     res: Response;
//     statusCode:number;
//     message:string;
//     data?:any
// }
// const ApiRes = async(res:any, statusCode:number, message:string, data=null)=>{
//     return res.status(statusCode).json({
//         statusCode: statusCode,
//         message: message ,
//         success: statusCode < 400, 
//         data: data || null,
//     });

       
    
// }
export {ApiRes};