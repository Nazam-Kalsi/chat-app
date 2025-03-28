// import React from 'react'

import { useEffect, useState } from "react";
import axios from "axios";
import { useDebounceValue } from "usehooks-ts";
import { useForm } from "react-hook-form";
import SearchModal from "./searchModal";
import { io } from "socket.io-client";
import { socket } from "@/socket";
import { useUser } from "@/context/session";
import { Loader2 } from "lucide-react";
import { getRandomGradient } from "@/constants";
import { Button } from "../ui/button";
import { useNavigate } from "react-router"

type ChatsProps = {
    name: string;
    time: string;
    onClick: () => void;
};
type SideBarProps = {
    setMessages: any;
    setChat: any;
    setLoadMore:any;
};

function Chats({ name, time, onClick }: ChatsProps) {
    const d = new Date(time);
    return (
        <button className="flex gap-4 items-center border-b p-2 w-full" onClick={onClick}>
            <div className={`rounded-full h-9 w-9 ${getRandomGradient()}`}>
            </div>
            <div>
            <p className="text-start font-semibold">{name}</p>
            <p className="text-gray-500 text-[9px]">
                {d.toLocaleDateString()} &nbsp;{d.toLocaleTimeString()}
            </p>
            </div>
        </button>
    );
}

function SideBar({ setMessages, setChat, setLoadMore }: SideBarProps) {
    const [existingFriends, setExistingFriends] = useState<any[]>([]);
    const [search, setSearch] = useState<{ loading: boolean; user: any }>({
        loading: true,
        user: [],
    });
    const navigate = useNavigate();
    const [open, setOpen] = useState<boolean>(false);
    const { register, watch } = useForm();
    const {user,loading} = useUser() as any;
    const [debouncedValue, setValue] = useDebounceValue<string>("", 800);
    const watchedValueOfSearch = watch("search");
    setValue(watchedValueOfSearch);
    useEffect(() => {
        if (debouncedValue) {
            (async () => {
                try {
                    const res = await axios.get(
                        `${
                            import.meta.env.VITE_URL
                        }/api/user/get-user?search=${debouncedValue}`
                    );
                    console.log(res);
                    setSearch({ loading: false, user: res.data.data });
                    setOpen(true);
                } catch (error) {}
            })();
        }
        console.log(debouncedValue);
    }, [debouncedValue]);

    const handleChatClick = async (chat: any) => {
        console.log(chat);
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_URL}/api/message/get-messages?page=1&limit=10`,
                { chatId: chat._id },
                { withCredentials: true }
            );
            if (!res) throw new Error();

            // await socket.emit(
            //     "create-and-join-room",
            //     // chat.participants[1].socketId,
            //     {
            //         u1: chat.participants[0].userName,
            //         u2: chat.participants[1].userName,
            //     }
            // );
            console.log("res. : ",res.data.data.messages);
            if(res.data.data.messages.length<10)setLoadMore(false);
            else setLoadMore(true);
            setMessages((prev: any) => [...res.data.data.messages]);
            setChat(chat);
        } catch (error) {
            console.log(error);
        }
    };

    const getAllFriends = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_URL}/api/user/get-friends`,
                { withCredentials: true }
            );
            // console.log(res);
            setExistingFriends(res?.data?.data);
        } catch (e) {
            console.log(e);
        }
    };
    useEffect(() => {
        getAllFriends();
    }, []);

    const logout = async() => {
        try{
            
            const res = await axios.get(`${import.meta.env.VITE_URL}/api/user/sign-out`,
                {withCredentials:true}
            )
            navigate('/sign-in')
            console.log("logout : ",res);
        }catch(e){console.log(e)}
    }

    return loading?<Loader2 className="animate-spin"/> : (
        <div className="w-4/12 border-r h-screen overflow-auto">
            <h2 className="text-2xl font-semibold p-3 border-b">Chats</h2>
            {user &&
            <div>
                <p className="p-2">My Account</p>
            <div className="flex items-center justify-between border-b p-2 w-full">
                <div className="flex gap-2">
             <div className={`rounded-full h-9 w-9 ${getRandomGradient()}`}/>
            <div>
            <p className="text-start font-semibold">{user.userName}</p>
            <p className="text-gray-500 text-[9px]">
                Joined - {new Date(user.createdAt).toLocaleDateString()}
            </p>
            </div>
                </div>
            <Button onClick={logout} variant='destructive'>Logout</Button>
            </div>
            </div>
            }
            <div className=" p-2 relative">
                <input
                    autoComplete="off"
                    type="text"
                    id="search"
                    placeholder="Search your friend..."
                    className="border p-2 w-full rounded-md"
                    {...register("search")}
                    onFocus={() => {
                        setOpen(true);
                        setSearch({ loading: true, user: [] });
                    }}
                />
                {open && <SearchModal user={search} setOpen={setOpen} setFriends={setExistingFriends}/>}
            </div>
            {existingFriends.length ? (
                <div className="">
                    {existingFriends.map((chat: any, index: number) => {
                        return (
                            <Chats
                                name={(user?.userName===chat.participants[0]?.userName) ? (chat.participants[1].userName) : (chat.participants[0]?.userName)}
                                time={chat.createdAt}
                                key={index}
                                onClick={() => handleChatClick(chat)}
                            />
                        );
                    })}
                </div>
            ) : (
                <p>Nothing</p>
            )}
        </div>
    );
}

export default SideBar;
