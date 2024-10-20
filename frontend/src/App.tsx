import './App.css'
import { useState } from 'react';
import {Box} from "./components"
// import {useNavigate} from "react-router-dom"
import { socket } from './socket';
function App() {
  const [data,setData]=useState("q");
 
  socket.on('welcome', (arg) => {
    setData(arg);
  });
  return (
    <>
     <h1>{data}</h1>
     <Box/>
    </>
  )
}

export default App
