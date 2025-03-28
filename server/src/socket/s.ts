import {  Server, Socket } from "socket.io";

interface MessageResponse {
    to: string;
    message:string
}
  
interface RoomResponse {
    roomName: string;
    userName: string;
}



var connectedUsers:any = {};
export const socketEvents=(io:Server)=>{    
    
    io.on("connection", async(socket:Socket) => { 

        socket.emit("welcome", `${socket.id}`); 

        socket.on('logged-in',async(data)=>{
            socket.userName = data.id;
            connectedUsers[data.id] = socket;
        })

        socket.on('private-chat',function(data:MessageResponse){
            if(connectedUsers.hasOwnProperty(data.to)){
                connectedUsers[data.to].emit('private-chat',{
                    userName : socket.userName,
                    message : data.message
                });
            }        
        }); 

        socket.on('typing',(content)=>{
            console.log(content.data);
            if(connectedUsers.hasOwnProperty(content.to)){
                connectedUsers[content.to].emit('typing')
            } 
        })

        // socket.on("send-message",(res:MessageResponse)=>{
        //     console.log(res)
        //     socket.broadcast.emit('message',res);
        // })

        //join room
        // { u1: 'test', u2: 'test2' }
        // socket.on("create-and-join-room",(res:any)=>{
        //     socket.join(`${res.u1}-${res.u2}`);
        //     io.to(`${res.u1}-${res.u12}`).emit('private-message',res);
        // })

        // socket.on("create-and-join-room", (anotherSocketId,msg) => {
        //     console.log("anotherSocketId : ",anotherSocketId);
        //     socket.join(anotherSocketId);
        //     console.log("msg : ",msg);
        //     socket.to(anotherSocketId).emit("private-message", socket.id, msg);
        // });

        socket.on("disconnect",(a)=>{
            console.log("user disconnect.",a)
        })
    });
    
}