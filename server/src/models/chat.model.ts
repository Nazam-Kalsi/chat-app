import mongoose from "mongoose";

const chatSchema=new mongoose.Schema({
    name:{
        type:String,
        trim:true,
    },
    isGroup:{
        type:Boolean,
        default:false
    },
    participants:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    admin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
},{timestamps:true});

export const Chat=new mongoose.Model("Chat",chatSchema);