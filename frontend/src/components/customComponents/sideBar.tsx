// import React from 'react'

import { useEffect, useState } from "react";
import axios from "axios";
import { useDebounceValue } from "usehooks-ts";
import { useForm } from "react-hook-form";
import SearchModal from "./searchModal";
import { useUser } from "@/context/session";
import {
    CircleUserRound,
    EllipsisVertical,
    Loader2,
    LogOut,
    MessageCircleMore,
    UsersRound,
} from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router";
import CreateGroup from "./createGroup";
import { socket } from "../../socket";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
type ChatsProps = {
    name: string;
    time: string;
    onClick: () => void;
    isGroup?: boolean;
    avatar: string;
    lastMessage:string,
};
type SideBarProps = {
    setMessages: any;
    setChat: any;
    setLoadMore: any;
    setFriends: any;
    friends:any
};

function Chats({ name, time, onClick, isGroup, avatar,lastMessage }: ChatsProps) {
    const d = new Date(time);
    return (
        <button
            className="flex gap-1 items-center p-2 px-4 w-full rounded-2xl hover:bg-gray-200 dark:hover:bg-black/30"
            onClick={onClick}
        >
            <img
                src={avatar || "q.jpg"}
                alt="img"
                className={`rounded-full size-10`}
                onError={(e) => (e.currentTarget.src = "q.jpg")}
            />
            <div className="self-start flex flex-col justify-between gap-1 items-start w-full">
                <div className="flex justify-between w-full">
                    <p className="text-start font-semibold leading-none">
                        {name.slice(0, 5)}
                        {name.length > 5 ? "..." : ""}
                    </p>
                    {isGroup && (
                        <p className="text-gray-500 text-[9px] self-end">
                            Group chat
                        </p>
                    )}
                </div>
                <div className="flex flex-wrap items-end justify-between w-full">
                {lastMessage.length>0 ?
                <p className="leading-none text-xs flex justify-center items-end gap-1">
                 <MessageCircleMore size={10}/>{lastMessage.slice(0,16)}{lastMessage.length > 5 ? "..." : ""}</p>
                 : <p className="leading-none text-xs animate-pulse">let's chat vro...</p>
                }
                {time.length>0 &&
                 <p className="text-gray-500 text-[9px]">
                    {d.toLocaleDateString()} &nbsp;{d.toLocaleTimeString()}
                </p>}
                </div>
            </div>
        </button>
    );
}

function SideBar({
    setMessages,
    setChat,
    setLoadMore,
    setFriends,
    friends
}: SideBarProps) {
    const [search, setSearch] = useState<{ loading: boolean; user: any }>({
        loading: true,
        user: [],
    });
    const navigate = useNavigate();
    const [open, setOpen] = useState<boolean>(false); // Search modal

    const { register, watch } = useForm();
    const { user, loading, setUser} = useUser() as any;
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
                        }/api/user/get-user?search=${debouncedValue}`,
                        { withCredentials: true }
                    );
                    setSearch({ loading: false, user: res.data.data });
                    setOpen(true);
                } catch (error) {}
            })();
        }
    }, [debouncedValue]);

    const handleChatClick = async (chat: any) => {
        try {
            const res = await axios.post(
                `${
                    import.meta.env.VITE_URL
                }/api/message/get-messages?page=1&limit=10`,
                { chatId: chat._id },
                { withCredentials: true }
            );
            if (!res) throw new Error();

            if (res.data.data.messages.length < 10) setLoadMore(false);
            else setLoadMore(true);
            setMessages([...res.data.data.messages]);
            setChat(chat);
        } catch (error) {
            console.log(error);
        }
    };
    
    useEffect(() => {
        const groups = friends
            ?.filter((chat:any) => chat.isGroup)
            ?.map((chat:any) => chat.name);

        socket.emit("join-group", groups);
    }, [friends]);

    const logout = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_URL}/api/user/sign-out`,
                { withCredentials: true }
            );
            navigate("/");
            console.log("logout : ", res);
            setUser(null);
        } catch (e) {
            console.log(e);
        }
    };

    return loading ? (
        <Loader2 className="animate-spin" />
    ) : (
        <div className="w-4/12 border-r h-screen">
            {/* 3-dot menu */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold p-3">Chats</h2>
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <EllipsisVertical />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="px-2 min-w-44 rounded-lg text-lg">
                        <DropdownMenuItem className="space-x-4" onClick={()=>{navigate(`/profile/${user._id}`)}}>
                            <CircleUserRound />
                            Profile
                        </DropdownMenuItem>
                        {/* Keep menu open for Create Group */}
                        <DropdownMenuItem
                            onSelect={(e) => {
                                e.preventDefault();
                            }}
                        >
                            <CreateGroup
                                header="Create a Group"
                                description="Mark the friends to add in a group"
                                friends={friends}
                            >
                                <p className="flex">
                                    <UsersRound /> Create Group
                                </p>
                            </CreateGroup>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={logout}
                            className="space-x-4"
                            variant="destructive"
                        >
                            <LogOut /> Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Search input */}
            <div className="p-2 relative">
                <input
                    autoComplete="off"
                    type="text"
                    id="search"
                    placeholder="Search your friend..."
                    className="border p-2 w-full rounded-4xl"
                    {...register("search")}
                    onFocus={() => {
                        setOpen(true);
                        setSearch({ loading: true, user: [] });
                    }}
                />
                {open && (
                    <SearchModal
                        user={search}
                        setOpen={setOpen}
                        setFriends={setFriends}
                    />
                )}
            </div>

            {/* Chats list */}
            {friends?.length ? (
                <div className="relative min-h-8/12 px-2 overflow-auto">
                    {friends.map((chat: any, index: number) => (
                        <Chats
                        lastMessage={chat?.lastMessage?.message || ""}
                            name={
                                chat.isGroup
                                    ? chat.name
                                    : user?.userName ===
                                      chat.participants[0]?.userName
                                    ? chat.participants[1].userName
                                    : chat.participants[0]?.userName
                            }
                            time={chat?.lastMessage?.createdAt || ""}
                            key={index}
                            onClick={() => handleChatClick(chat)}
                            isGroup={chat.isGroup}
                            avatar={chat.avatar}
                        />
                    ))}
                </div>
            ) : (
                <p>Nothing</p>
            )}
        </div>
    );
}

export default SideBar;
