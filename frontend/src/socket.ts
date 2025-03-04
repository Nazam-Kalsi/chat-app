import { io } from "socket.io-client";

const url="http://localhost:3000/";
export const socket= io(url);

socket.on('connection', () => {
    console.log('Connected to server');
});

socket.on("message", (msg) => {
    console.log(msg);
    // setRecieveMsg((prev) => (prev ? [...prev, msg] : [msg]))
  });

  socket.on("user-joined",(res)=>{
    console.log(res);
  })