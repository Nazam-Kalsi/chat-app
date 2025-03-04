import express  from "express";
import { createServer,Server as httpServer } from "http";
import { Server as socketServer, Socket } from "socket.io";
import cors from 'cors';
const app = express();

export const server : httpServer=createServer(app);

const corsOptions = {
    origin: "*",
    // methods: ["GET", "POST"],
    // credentials: true,
  };

export const io:socketServer = new socketServer(server,{
    cors:corsOptions,
}) 

app.use(express.json({
  limit:"20kb"
}))

app.use(express.urlencoded({ 
  extended: true,
  limit:"20kb"
}));
app.use(cors({
  origin:'*'
}));

import userRouter from './routes/user.route.ts'
app.use('/api/user',userRouter);
