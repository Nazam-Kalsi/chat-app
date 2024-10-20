export const handler=(fxn:any)=>{
    return ({req,res,next}:{req:any,res:any,next:any})=>{
        Promise.resolve(fxn(req,res,next))
        .catch((err)=>next(err))
    }
} 