// import React from 'react'

import { useEffect, useState } from "react";
import axios from "axios";
import { useDebounceValue } from "usehooks-ts";
import { useForm } from "react-hook-form";
import SearchModal from "./searchModal";
type ChatsProps = {
    name: string;
    time: string;
    onClick: () => void;
};
type SideBarProps = {
    setMessages: any;
};

function Chats({ name, time, onClick }: ChatsProps) {
    return (
        <button className="border-b p-2" onClick={onClick}>
            <p className="font-semibold mb-2">{name}</p>
            <p className="text-gray-500 text-sm">{time}</p>
        </button>
    );
}

function SideBar({ setMessages }: SideBarProps) {
    const [existingFriends, setExistingFriends] = useState<any[]>([]);
    const [searchedUsers, setSearchedUsers] = useState<any[]>([]);
    const [open, setOpen] = useState<boolean>(false);
    const { register, watch } = useForm();
    const [debouncedValue, setValue] = useDebounceValue("", 800);
    const watchedValueOfSearch = watch("search");
    setValue(watchedValueOfSearch);
    useEffect(() => {
        (async () => {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_URL}/api/user/getUser?search=${debouncedValue}`
                );
                console.log(res);
                setSearchedUsers(res.data.data);
            } catch (error) {}
        })();
        console.log(debouncedValue);
    }, [debouncedValue]);

    const handleChatClick = async (chat: any) => {
        console.log(chat);
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_URL}/api/chat/get-chat`
            );
            console.log(res);
            setMessages((prev: any) => prev + res.data.data);
        } catch (error) {
            console.log(error);
        }
    };

    const getAllFriends = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_URL}/api/user/get-friends`
            );
            console.log(res);
            setExistingFriends(res?.data?.data);
        } catch (e) {
            console.log(e);
        }
    };
    // useEffect(() => {
    //     getAllFriends();
    // }, []);

    return (
        <div className="w-4/12 border-r">
            <div className="p-2">
                <input
                    autoComplete="off"
                    type="text"
                    id="search"
                    placeholder="Search..."
                    className="border p-2 w-full rounded-md"
                    {...register("search")}
                    onFocus={() => setOpen(true)}
                    onBlur={() => setTimeout(() => setOpen(false), 1000)}
                />
                <SearchModal user ={searchedUsers}/>
            </div>
            {existingFriends.length ? (
                existingFriends.map((chat: any, index: number) => {
                    return (
                        <Chats
                            name={chat.participants[0]}
                            time={chat.createdAt}
                            key={index}
                            onClick={() => handleChatClick(chat)}
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
