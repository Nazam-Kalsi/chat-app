import { Server, Socket } from "socket.io";

interface MessageResponse {
    text: string;
  }
  
  interface RoomResponse {
    roomName: string;
    userName: string;
  }
  


export const socketEvents=(io:Server)=>{    
    
    io.on("connection", (socket:Socket) => {        
        
        socket.emit("welcome", `${socket.id}`); 

        socket.on("send-message",(res:MessageResponse)=>{
            console.log(res)
            socket.broadcast.emit('message',res);
        })

        //join room
        socket.on("create-and-join-room",(res:any)=>{
            // socket.join(res.roomName);
            // io.to(res.roomName).emit('user-joined', `${res.userName} joined`);
            console.log("res in io ",res)
        })

        // socket.on("disconnect",()=>{
        //     console.log("user disconnect.")
        // })
    });

    
}