import {useRef, useState} from 'react'
import {MessageInput} from "../index.ts"
import { socket } from '../../socket.ts';
function Box() {
  const msgRef=useRef<HTMLDivElement>(null);
  const [room,setRoom]=useState("");
  const [user,setUser]=useState("");

  const join=()=>{
    socket.emit("room",{
      userName:user,
      roomName:room,
      id:socket.id
    })
  }

  return (
    <div>
      <div ref={msgRef}>
        
      </div>
        Name : <input type="text" onChange={e=>setUser(e.target.value)} value={user} required/>
        Room : <input type="text" onChange={e=>setRoom(e.target.value)} value={room} required/>
        <button onClick={join}>Join</button>
        <MessageInput />
    </div>
  )
}

export default Box