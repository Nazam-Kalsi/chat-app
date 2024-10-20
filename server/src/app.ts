import express  from "express";
import { createServer,Server as httpServer } from "http";
import { Server as socketServer, Socket } from "socket.io";
import {socketEvents} from "./socket/s"

const app = express();

export const server : httpServer=createServer(app);

const corsOptions = {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
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


