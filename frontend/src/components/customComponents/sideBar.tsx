// import React from 'react'

import { useEffect, useState } from "react";
import axios from "axios";


type ChatsProps = {
    name: string;
    time: string;
    onClick:() => void;
};
type SideBarProps = {
    setMessages:any; 
};

function Chats({ name, time, onClick }: ChatsProps) {
    return (
        <button className="border-b p-2" onClick={onClick}>
            <p className="font-semibold mb-2">{name}</p>
            <p className="text-gray-500 text-sm">{time}</p>
        </button>
    );
}

function SideBar({setMessages}:SideBarProps) {
    const [chat, setChats] = useState<any[]>([]);

    const handleChatClick = async(chat:any) => {
        console.log(chat);
        try {
            const res = await axios.get("http://localhost:5000/api/chat/get-chat");
            console.log(res); 
            setMessages((prev:any)=>prev+res.data.data)
        } catch (error) {
            console.log(error);
        }
    }

    const getAllFriends = async () => {
        try {
            const res = await axios.get(
                "http://localhost:5000/api/user/get-friends"
            );
            console.log(res);
            setChats(res?.data?.data);
        } catch (e) {
            console.log(e);
        }
    };

    // useEffect(() => {
    //     getAllFriends();
    // }, []);

    return (
        <div className="w-4/12">
            <div>
                
            </div>
            {chat.length ? (
                chat.map((chat: any, index: number) => {
                    return (
                        <Chats
                            name={chat.participants[0]}
                            time={chat.createdAt}
                            key={index}
                            onClick={()=>handleChatClick(chat)}
                        />
                    );
                })
            ) : (
                <p>Nothing</p>
            )}
        </div>
    );
}

export default SideBar;
