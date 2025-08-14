import express  from "express";
import { createServer,Server as httpServer } from "http";
import { Server as socketServer, Socket } from "socket.io";
import cors from 'cors';
import cookieParser from "cookie-parser";
import cloudinary from "cloudinary";
import dotenv from 'dotenv';
dotenv.config();

export const cloudinaryConfig =  cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const app = express();

export const server : httpServer=createServer(app);

const corsOptions = {
    origin: "http://localhost:5173",
    // methods: ["GET", "POST"],
    credentials: true,
  };

export const io:socketServer = new socketServer(server,{
    cors:corsOptions,
}) 

// io.use((socket, next) => {
//   const userName = socket.handshake.auth.username;
//   if (!userName) {
//     return next(new Error("invalid username"));
//   }
//   socket.userName = userName;
//   console.log("userName : ",userName);
//   next();
// });

app.use(express.json({
  limit:"20kb"
}))

app.use(express.urlencoded({ 
  extended: true,
  limit:"20kb"
}));
app.use(cors(corsOptions));

app.use(express.json());

app.use(cookieParser());

app.use(express.static("public"));

import userRouter from './routes/user.route.ts'
app.use('/api/user',userRouter);

app.get('/', (req, res) => {
  res.send('Vro! Vro! Vro! 👍')
})

import messageRouter from './routes/message.route.ts'
app.use('/api/message',messageRouter);

import chatRouter from './routes/chat.route.ts'
import { ApiErr, errorHandlerMiddleWare } from "./utils/apiErr.ts";
app.use('/api/chat',chatRouter);


app.use(errorHandlerMiddleWare);