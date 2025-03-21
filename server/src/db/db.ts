import mongoose from "mongoose";

const dbConnect=async()=>{
    try{
        const connection=await mongoose.connect(`${process.env.DB_URL}`)
        console.log(`Database connected : ${connection.connection.host}`)
    }
    catch(e){
        console.log(`Error while database connect : ${e}`)
    }
}

export default dbConnect;