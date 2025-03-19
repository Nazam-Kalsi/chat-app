// import './App.css'
import { useState } from 'react';
// import {useNavigate} from "react-router-dom"
import { socket } from './socket';
import { Outlet } from 'react-router';
import ThemeToggler from './components/customComponents/themeToggler';
function App() {
  const [data,setData]=useState("Not connected");
 
  socket.on('welcome', (arg) => {
    setData(arg);
  });
  return (
    <>
     <ThemeToggler/>
     <h1 className='bg-green-600'>{data}</h1>
     <Outlet/>
    </>
  )
}

export default App
