import { io } from "socket.io-client";

const url= "http://localhost:8000/";
import.meta.env.VITE_URL
export const socket= io(url);

socket.on('connection', () => {
    console.log('Connected to server');
});

// socket.on("message", (msg) => {
//     console.log(msg);
//     // setRecieveMsg((prev) => (prev ? [...prev, msg] : [msg]))
//   });

  socket.on("user-joined",(res)=>{
    console.log(res);
  })