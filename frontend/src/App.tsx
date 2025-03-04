import './App.css'
import { useState } from 'react';
// import {useNavigate} from "react-router-dom"
import { socket } from './socket';
import { Outlet } from 'react-router';
function App() {
  const [data,setData]=useState("Not connected");
 
  socket.on('welcome', (arg) => {
    console.log(arg);
    setData(arg);
  });
  return (
    <>
     <h1 className='bg-red-600'>{data}</h1>
     <Outlet/>
    </>
  )
}

export default App
