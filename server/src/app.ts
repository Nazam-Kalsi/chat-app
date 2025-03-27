import express  from "express";
import { createServer,Server as httpServer } from "http";
import { Server as socketServer, Socket } from "socket.io";
import cors from 'cors';
import cookieParser from "cookie-parser";
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

import userRouter from './routes/user.route.ts'
app.use('/api/user',userRouter);

import messageRouter from './routes/message.route.ts'
app.use('/api/message',messageRouter);

import chatRouter from './routes/chat.router.ts'
import { ApiErr, errorHandlerMiddleWare } from "./utils/apiErr.ts";
app.use('/api/chat',chatRouter);


app.use(errorHandlerMiddleWare);