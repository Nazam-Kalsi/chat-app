import mongoose,{Document} from "mongoose";
import bcrypt from "bcrypt";
import  jwt  from "jsonwebtoken";

interface IUser extends Document{
    userName:string;
    email: string;
    password:string;
    refreshToken:string;
    checkPassword(password: string):Promise<boolean>;
    generateRefreshToken():Promise<string>;
    generateAccessToken():Promise<string>;
} 

const userSchema = new mongoose.Schema<IUser>({
    userName:{
        type:String,
        required:[true,"Username is required!"],
        trim:true,
    },
    email:{
        type:String,
        required:[true,"email is required !"],
        trim:true,
    },
    password:{
        type:String,
        required:true,
    },
    refreshToken:{
        type:String,
    }
},{timestamps:true})

userSchema.pre("save",async function(next){
    if(this.isModified("password")){
        this.password=await bcrypt.hash(this.password,8);
    }
})

userSchema.methods.checkPassword=async function(password:string){
    return bcrypt.compare(password,this.password);
}

userSchema.methods.generateRefreshToken=async function(){
    if (!process.env.REFRESH_TOKEN_SECRET) {
        throw new Error("Missing REFRESH_TOKEN_SECRET in environment variables");
      }
    return jwt.sign({
        _id:this._id,
        userName:this.userName,   
    },
    process.env.REFRESH_TOKEN_SECRET,{
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY || "1d"
    }
)
}

userSchema.methods.generateAccessToken=async function(){
    if(!process.env.ACCESS_TOKEN_SECRET){
        throw new Error("ACCESS_TOKEN_SECRET is not set in environment variables")
    }
    return jwt.sign({
        _id:this._id,
        userName:this.userName,
    },process.env.ACCESS_TOKEN_SECRET,{
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY || "10d"
    })
}

export const User = mongoose.model("User",userSchema);
