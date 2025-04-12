// import './App.css'
import { useEffect, useState } from "react";
// import {useNavigate} from "react-router-dom"
import { socket } from "./socket";
import { Outlet } from "react-router";
import ThemeToggler from "./components/customComponents/themeToggler";
import { useUser } from "./context/session";
import axios from "axios";
import { Toaster } from "@/components/ui/sonner"

function App() {
    const [data, setData] = useState("Not connected");
    const { setUser,setLoading } = useUser();
    useEffect(() => {
        (async () => {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_URL}/api/user/get-current-user`,
                    { withCredentials: true }
                );
                if(!res)throw new Error;
                // console.log("current user : ", res);
                setUser(res.data?.data);
                setData(res.data?.data?.userName+" - "+res?.data?.data?._id);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                console.log(error);
            }
        })();
    }, []);

    return (
        <>
            <Toaster richColors />
            <ThemeToggler />
            {/* <h1 className="">{data}</h1> */}
            <Outlet />
        </>
    );
}

export default App;
