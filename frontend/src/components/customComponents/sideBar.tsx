// import React from 'react'

import { useEffect, useState } from "react";
import axios from "axios";
import { useDebounceValue } from "usehooks-ts";
import { useForm } from "react-hook-form";
import SearchModal from "./searchModal";
import { io } from "socket.io-client";
import { socket } from "@/socket";
type ChatsProps = {
    name: string;
    time: string;
    onClick: () => void;
};
type SideBarProps = {
    setMessages: any;
    setChat: any;
    setPage:any;
};

function Chats({ name, time, onClick }: ChatsProps) {
    const d = new Date(time);
    return (
        <button className="border-b p-2 w-full" onClick={onClick}>
            <p className="font-semibold mb-2">{name}</p>
            <p className="text-gray-500 text-sm">
                {d.toLocaleDateString()} &nbsp;&nbsp;{d.toLocaleTimeString()}
            </p>
        </button>
    );
}

function SideBar({ setMessages, setChat, setPage }: SideBarProps) {
    const [existingFriends, setExistingFriends] = useState<any[]>([]);
    const [search, setSearch] = useState<{ loading: boolean; user: any }>({
        loading: true,
        user: [],
    });
    const [open, setOpen] = useState<boolean>(false);
    const { register, watch } = useForm();
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
        setPage(1);
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

    return (
        <div className="w-4/12 border-r">
            <div className="p-2 relative">
                <input
                    autoComplete="off"
                    type="text"
                    id="search"
                    placeholder="Search..."
                    className="border p-2 w-full rounded-md"
                    {...register("search")}
                    onFocus={() => {
                        setOpen(true);
                        setSearch({ loading: true, user: [] });
                    }}
                />
                {open && <SearchModal user={search} setOpen={setOpen} />}
            </div>
            {existingFriends.length ? (
                <div className="">
                    {existingFriends.map((chat: any, index: number) => {
                        return (
                            <Chats
                                name={chat.participants[0].userName}
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
