// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter, Routes, Route } from "react-router";
import SignUp from './pages/SignUp.tsx';
import SignIn from './pages/SignIn.tsx';
import Chat from './pages/Chat.tsx';

const CustomRoutes = ()=> {
  return(
    <Routes>
      <Route path='/' element={<App/>}>
      <Route index element={<Chat/>}/>
      </Route>
      <Route path='/sign-in' element={<SignIn/>}/>
      <Route path='/sign-up' element={<SignUp/>}/>
    </Routes>
  )
}

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <BrowserRouter>
    <CustomRoutes/>
  </BrowserRouter>
  // </StrictMode>,
)
