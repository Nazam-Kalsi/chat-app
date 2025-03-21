// import './App.css'
import { useState } from 'react';
// import {useNavigate} from "react-router-dom"
import { socket } from './socket';
import { Outlet } from 'react-router';
import ThemeToggler from './components/customComponents/themeToggler';
import { UserContextProvider } from './context/session';
function App() {
  const [data,setData]=useState("Not connected");
 
  socket.on('welcome', (arg) => {
    setData(arg);
  });
  return (
    <>
     <ThemeToggler/>
     <h1 className=''>{data}</h1>
     <UserContextProvider>
     <Outlet/>
     </UserContextProvider>
    </>
  )
}

export default App
