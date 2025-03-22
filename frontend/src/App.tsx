// import './App.css'
import { useEffect, useState } from "react";
// import {useNavigate} from "react-router-dom"
import { socket } from "./socket";
import { Outlet } from "react-router";
import ThemeToggler from "./components/customComponents/themeToggler";
import { useUser } from "./context/session";
import axios from "axios";
function App() {
    const [data, setData] = useState("Not connected");
    const { user, setUser } = useUser();
    useEffect(() => {
        (async () => {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_URL}/api/user/get-current-user`,
                    { withCredentials: true }
                );
                console.log("current user : ", res);
                setUser(res.data.data);
            } catch (error) {
                console.log(error);
            }
        })();
    }, []);

    socket.on("welcome", (arg) => {
        setData(arg);
    });
    return (
        <>
            <ThemeToggler />
            <h1 className="">{data}</h1>
            <Outlet />
        </>
    );
}

export default App;
