import { DefaultEventsMap, Server, Socket } from "socket.io";

interface MessageResponse {
    text: string;
  }
  
  interface RoomResponse {
    roomName: string;
    userName: string;
  }
  


export const socketEvents=(io:Server)=>{    
    
    io.on("connection", async(socket:Socket) => { 
        // const userId = await computeUserIdFromHeaders(socket);
    //    console.log(userId);
        
        socket.emit("welcome", `${socket.id}`); 

        socket.on("send-message",(res:MessageResponse)=>{
            console.log(res)
            socket.broadcast.emit('message',res);
        })

        //join room
        // { u1: 'test', u2: 'test2' }
        // socket.on("create-and-join-room",(res:any)=>{
        //     socket.join(`${res.u1}-${res.u2}`);
        //     io.to(`${res.u1}-${res.u12}`).emit('private-message',res);
        // })

        socket.on("create-and-join-room", (anotherSocketId,msg) => {
            console.log("anotherSocketId : ",anotherSocketId);
            socket.join(anotherSocketId);
            console.log("msg : ",msg);
            socket.to(anotherSocketId).emit("private-message", socket.id, msg);
        });

    

        // socket.on("disconnect",()=>{
        //     console.log("user disconnect.")
        // })
    });
    
}

function computeUserIdFromHeaders(socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) {
    throw new Error("Function not implemented.");
}
