// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter, Routes, Route } from "react-router";
import SignUp from './pages/SignUp.tsx';
import SignIn from './pages/SignIn.tsx';
import Chat from './pages/Chat.tsx';
import { UserContextProvider } from './context/session.tsx';

const CustomRoutes = ()=> {
  return(
    <Routes>
      <Route path='/' element={<App/>}>
      <Route index element={<Chat/>}/>
      <Route path='/sign-in' element={<SignIn/>}/>
      <Route path='/sign-up' element={<SignUp/>}/>
      </Route>
    </Routes>
  )
}

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <UserContextProvider>
  <BrowserRouter>
    <CustomRoutes/>
  </BrowserRouter>
  </UserContextProvider>
  // </StrictMode>,
)
