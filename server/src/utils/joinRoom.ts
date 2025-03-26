import { io } from "../app.ts"
type RoomType = {
    type:string;
    roomName:string;
}

export const room = (type:string,roomName:string)=>{
    io.on(type, (socket)=>{
        socket.join(roomName)
    })
}

// export const room = (type:string, roomName:string ) => {
//     io.on("connection", (socket) => { // Listen for the 'connection' event
//         socket.on(type, () => { // Listen for the custom event 'type'
//             socket.join(roomName); // Join the specified room
//             console.log(`Socket joined room: ${roomName}`);
//         });
//     });
// };
