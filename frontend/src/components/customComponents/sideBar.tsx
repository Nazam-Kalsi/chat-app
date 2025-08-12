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
};
type SideBarProps = {
    setMessages: any;
    setChat: any;
    setLoadMore: any;
    setFriends: any;
};

function Chats({ name, time, onClick, isGroup, avatar }: ChatsProps) {
    const d = new Date(time);
    return (
        <button
            className="flex gap-4 items-center p-2 px-4 w-full rounded-2xl hover:bg-gray-200 dark:hover:bg-black/30"
            onClick={onClick}
        >
            <img
                src={avatar || "q.jpg"}
                alt="img"
                className={`rounded-full size-10`}
                onError={(e) => (e.currentTarget.src = "q.jpg")}
            />
            <div className="self-start flex justify-between items-start w-full">
                <div className="flex justify-between">
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
                <p className="text-gray-500 text-[9px]">
                    {d.toLocaleDateString()} &nbsp;{d.toLocaleTimeString()}
                </p>
            </div>
        </button>
    );
}

// function SideBar({ setMessages, setChat, setLoadMore, setFriends }: SideBarProps) {
//     const [existingChats, setExistingChats] = useState<any[]>([]);
//     const [search, setSearch] = useState<{ loading: boolean; user: any }>({
//         loading: true,
//         user: [],
//     });
//     const navigate = useNavigate();
//     const [open, setOpen] = useState<boolean>(false);
//     const [groupChatsName, setGroupChatsName] = useState<Array<string>>([]);
//     const [openGroup, setOpenGroup] = useState(false);

//     const { register, watch } = useForm();
//     const {user,loading} = useUser() as any;
//     const [debouncedValue, setValue] = useDebounceValue<string>("", 800);
//     const watchedValueOfSearch = watch("search");
//     setValue(watchedValueOfSearch);
//     useEffect(() => {
//         if (debouncedValue) {
//             (async () => {
//                 try {
//                     const res = await axios.get(
//                         `${
//                             import.meta.env.VITE_URL
//                         }/api/user/get-user?search=${debouncedValue}`,
//                         {withCredentials:true}
//                     );
//                     setSearch({ loading: false, user: res.data.data });
//                     setOpen(true);
//                 } catch (error) {}
//             })();
//         }
//     }, [debouncedValue]);

//     const handleChatClick = async (chat: any) => {
//         try {
//             const res = await axios.post(
//                 `${import.meta.env.VITE_URL}/api/message/get-messages?page=1&limit=10`,
//                 { chatId: chat._id },
//                 { withCredentials: true }
//             );
//             if (!res) throw new Error();

//             // await socket.emit(
//             //     "create-and-join-room",
//             //     // chat.participants[1].socketId,
//             //     {
//             //         u1: chat.participants[0].userName,
//             //         u2: chat.participants[1].userName,
//             //     }
//             // );
//             if(res.data.data.messages.length<10)setLoadMore(false);
//             else setLoadMore(true);
//             setMessages((prev: any) => [...res.data.data.messages]);
//             setChat(chat);
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     const getAllFriends = async () => {
//         try {
//             const res = await axios.get(
//                 `${import.meta.env.VITE_URL}/api/user/get-friends`,
//                 { withCredentials: true }
//             );
//             // console.log(res);
//             setExistingChats(res?.data?.data);
//             setFriends(()=>{
//                 const f = (res?.data?.data)?.filter((f:any)=>!f.isGroup);
//                 return f;
//             })
//         } catch (e) {
//             console.log(e);
//         }
//     };
//     useEffect(() => {
//         getAllFriends();
//     }, []);

//     useEffect(()=>{
//         const groups = existingChats?.filter(chat => chat.isGroup)?.map(chat => chat.name)

//         socket.emit('join-group',groups)

//     },[existingChats])

//     const logout = async() => {
//         try{

//             const res = await axios.get(`${import.meta.env.VITE_URL}/api/user/sign-out`,
//                 {withCredentials:true}
//             )
//             navigate('/sign-in')
//             console.log("logout : ",res);
//         }catch(e){console.log(e)}
//     }

//     return loading?<Loader2 className="animate-spin"/> : (
//         <div className="w-4/12 border-r h-screen">
//             {/* 3-dot menu*/}
//             <div className = 'flex justify-between items-center'>
//             <h2 className="text-2xl font-semibold p-3">Chats</h2>
//              <DropdownMenu>
//                 <DropdownMenuTrigger><EllipsisVertical/></DropdownMenuTrigger>
//                 <DropdownMenuContent className = 'px-2 min-w-44 rounded-lg text-lg'>
//                     <DropdownMenuItem onClick={()=>{navigate(`/profile/${user._id}`)}} className = 'space-x-4'><CircleUserRound />Profile</DropdownMenuItem>
//                     <DropdownMenuItem>
//                     <CreateGroup
//                       header="Create a Group"
//                       description="Mark the friends to add in a group"
//                       friends={existingChats}
//                       >
//                         <p className='flex'><UsersRound />Create Group</p>
//                       </CreateGroup>
//                     </DropdownMenuItem>

//                     <DropdownMenuSeparator />
//                     <DropdownMenuItem variant="destructive" className="space-x-4"> <LogOut/>Logout</DropdownMenuItem>
//                 </DropdownMenuContent>
//             </DropdownMenu>
//             </div>
//             <div className=" p-2 relative">
//                 <input
//                     autoComplete="off"
//                     type="text"
//                     id="search"
//                     placeholder="Search your friend..."
//                     className="border p-2 w-full rounded-md"
//                     {...register("search")}
//                     onFocus={() => {
//                         setOpen(true);
//                         setSearch({ loading: true, user: [] });
//                     }}
//                 />
//                 {open && <SearchModal user={search} setOpen={setOpen} setFriends={setExistingChats}/>}
//             </div>
//             {existingChats && existingChats?.length ? (
//                 <div className="relative min-h-8/12 overflow-auto">
//                     {existingChats.map((chat: any, index: number) => {
//                         return (
//                             <Chats
//                                 name={chat.isGroup?chat.name:(user?.userName===chat.participants[0]?.userName) ? (chat.participants[1].userName) : (chat.participants[0]?.userName)}
//                                 time={chat.createdAt}
//                                 key={index}
//                                 onClick={() => handleChatClick(chat)}
//                                 isGroup={chat.isGroup}
//                                 avatar={chat.avatar}
//                             />
//                         );
//                     })}
//                     {/* <CreateGroup header="Create a Group" description="Mark the friends to add in a group" friends={existingChats} open={openGroup} onOpenChange={setOpenGroup}/> */}
//                 </div>
//             ) : (
//                 <p>Nothing</p>
//             )}
//         </div>
//     );
// }
function SideBar({
    setMessages,
    setChat,
    setLoadMore,
    setFriends,
}: SideBarProps) {
    const [existingChats, setExistingChats] = useState<any[]>([]);
    const [search, setSearch] = useState<{ loading: boolean; user: any }>({
        loading: true,
        user: [],
    });
    const navigate = useNavigate();
    const [open, setOpen] = useState<boolean>(false); // Search modal
    const [openGroup, setOpenGroup] = useState(false); // Create Group dialog

    const { register, watch } = useForm();
    const { user, loading } = useUser() as any;
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

    const getAllFriends = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_URL}/api/user/get-friends`,
                { withCredentials: true }
            );
            setExistingChats(res?.data?.data);
            setFriends(() => {
                const f = res?.data?.data?.filter((f: any) => !f.isGroup);
                return f;
            });
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        getAllFriends();
    }, []);

    useEffect(() => {
        const groups = existingChats
            ?.filter((chat) => chat.isGroup)
            ?.map((chat) => chat.name);

        socket.emit("join-group", groups);
    }, [existingChats]);

    const logout = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_URL}/api/user/sign-out`,
                { withCredentials: true }
            );
            navigate("/sign-in");
            console.log("logout : ", res);
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
                                friends={existingChats}
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
                        setFriends={setExistingChats}
                    />
                )}
            </div>

            {/* Chats list */}
            {existingChats?.length ? (
                <div className="relative min-h-8/12 px-2 overflow-auto">
                    {existingChats.map((chat: any, index: number) => (
                        <Chats
                            name={
                                chat.isGroup
                                    ? chat.name
                                    : user?.userName ===
                                      chat.participants[0]?.userName
                                    ? chat.participants[1].userName
                                    : chat.participants[0]?.userName
                            }
                            time={chat.createdAt}
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
