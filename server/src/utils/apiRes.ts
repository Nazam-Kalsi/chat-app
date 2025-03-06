// class ApiRes{
//     statusCode:number;
//     message:string;
//     data?:any;
//     success:boolean;
//     constructor(statusCode:number,message="success",data?:any){
//         this.statusCode=statusCode;
//         this.message=message;
//         this.data=data;
//         this.success=statusCode<400;
//     }
// }


const ApiRes = ( statusCode:number, message:string, data:any=null)=>{
    return {
            statusCode: statusCode,
            message: message ,
            success: statusCode < 400, 
            data: data
          }
}
export {ApiRes};