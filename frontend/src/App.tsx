import './App.css'
import { useState } from 'react';
import {Box} from "./components"
// import {useNavigate} from "react-router-dom"
import { socket } from './socket';
function App() {
  const [data,setData]=useState("Not connected");
 
  socket.on('welcome', (arg) => {
    setData(arg);
  });
  return (
    <>
     <h1 className='bg-red-600'>{data}</h1>
     <Box/>
    </>
  )
}

export default App
