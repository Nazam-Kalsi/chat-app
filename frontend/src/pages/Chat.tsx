import { useRef, useState, useEffect } from "react";
import { useUser } from "@/context/session";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { chatSchema } from "@/schema/chat.schema";
import { RainbowButton } from "@/components/ui/rainbow-button";

import { z } from "zod";
import { Button } from "@/components/ui/button";
import { SendHorizonal, XCircle } from "lucide-react";
import MessageContainer from "@/components/customComponents/messageContainer";
import SideBar from "@/components/customComponents/sideBar";
import axios from "axios";
import { socket } from "../socket";
import { toast } from "sonner";
import UpdateGroup from "@/components/customComponents/updateGroup";
function Chat() {
    const messagesContainerRef = useRef<HTMLDivElement | null>(null);
    const [currentMessages, setCurrentMessages] = useState<any>([]);
    const [friendInfoSidebarOpen, setFriendInfoSidebarOpen] =
        useState<boolean>(false);
    const [friends, setFriends] = useState<any>();
    const [chat, setChat] = useState<any>();
    const [page, setPage] = useState<number>(2);
    const limit = 10;
    const [loadMore, setLoadMore] = useState<boolean>(true);
    const [typing, setTyping] = useState<boolean>(false);
    const [scroll, setScroll] = useState<boolean>(true);
    // const [userSocketId, setUserSocketId] = useState<string>("");
    const navigate = useNavigate();
    const { user, loading } = useUser() as any;

    useEffect(() => {
        if (!loading && (user === null || user === undefined)) {
            navigate("/sign-in");
        }
        console.log("user to test : ", user);
    }, [user, loading]);

    socket.emit("logged-in", { id: user?._id, userName: user?.userName });

    socket.on("welcome", async (arg) => {
        // setUserSocketId(arg);
        // try {
        //     const res = await axios.patch(`${import.meta.env.VITE_URL}/api/user/update-user`,
        //         {socketId:arg},
        //         {withCredentials:true});
        //     console.log("Update socket id in db : ",res);
        //     if(!res) throw new Error;
        //     setUser(res.data.data);
        //    } catch (error) {
        //         console.log(error);
        //    }
        console.log(arg);
    });

    // for world chat
    // socket.on('message',(m)=>{
    //     console.log("message recieved : ",m,user);
    //     setCurrentMessages([...currentMessages, {message:m.message, sender:m.sender, createdAt:new Date()}]);
    // })

    socket.on("private-chat", function (data) {
        setCurrentMessages([
            ...currentMessages,
            {
                message: data.message,
                sender: data.userName,
                createdAt: new Date(),
            },
        ]);
    });

    socket.on("group-chat", (data) => {
        setCurrentMessages([
            ...currentMessages,
            {
                message: data.message,
                sender: data.by,
                createdAt: new Date(),
            },
        ]);
    });

    const { register, handleSubmit, setValue } = useForm<
        z.infer<typeof chatSchema>
    >({
        resolver: zodResolver(chatSchema),
        defaultValues: {
            message: "",
        },
    });

    useEffect(() => {
        // scroll ? messagesContainerRef.current.scrollHeight :
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTo({
                top: scroll ? messagesContainerRef.current.scrollHeight : 0,
                behavior: "smooth",
            });
            setTimeout(() => {
                setScroll(true);
            }, 700);
        }
    }, [currentMessages]);
    const submit = async (data: z.infer<typeof chatSchema>) => {
        setCurrentMessages([
            ...currentMessages,
            {
                message: data.message,
                sender: { _id: user?._id, userName: user.usrName },
                createdAt: new Date(),
            },
        ]);
        try {
            if (!chat.isGroup) {
                socket.emit("private-chat", {
                    to: chat.participants[0]._id,
                    message: data.message,
                });
            } else {
                socket.emit("group-chat", {
                    to: chat.name,
                    message: data.message,
                    by: user.userName,
                });
            }
            const res: any = await axios.post(
                `${import.meta.env.VITE_URL}/api/message/send-message/${
                    chat._id
                }`,
                { messageContent: data.message },
                { withCredentials: true }
            );

            if (!res && !res.ok) {
                const e = await res.json();
                throw new Error(e.message);
            }
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("An unknown error occurred");
            }
            console.log(error);
        }
        setValue("message", "");
    };

    const loadMoreChats = async () => {
        setPage((prev: number) => prev + 1);
        try {
            const res = await axios.post(
                `${
                    import.meta.env.VITE_URL
                }/api/message/get-messages?page=${page}&limit=${limit}`,
                { chatId: chat._id },
                { withCredentials: true }
            );

            if (res.data.data.messages.length < 10) setLoadMore(false);
            setScroll(false);
            setCurrentMessages((prev: any) => [
                ...res.data.data.messages,
                ...prev,
            ]);
        } catch (e) {
            console.log(e);
        }
    };

    const keyPressed = async (e: any) => {
        socket.emit("typing", {
            to:chat.participants[0]._id,                
            data: e.nativeEvent.data,
        });
    };

    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    socket.on("typing", () => {
        setTyping(true);
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
        typingTimeoutRef.current = setTimeout(() => {
            setTyping(false);
        }, 1500);
    });

    const deleteChat = async() => {
        const res = await axios.delete(`${import.meta.env.VITE_URL}/api/message/delete-messages/${chat._id}`,{withCredentials:true});
        console.log(res);
        setCurrentMessages([]);

        
    }
    const removeFriend = async() => {
        console.log(chat._id);
         const res = await axios.delete(`${import.meta.env.VITE_URL}/api/chat/remove-friend/${chat._id}`,{withCredentials:true});
        console.log(res);
        setChat(null);
        setFriends((prev:any)=>prev.filter((f:any)=>f._id!==chat._id));
        setFriendInfoSidebarOpen(false);
        
    }
console.log("in chat compoment:",chat)
    return (
        <div className="flex">
            <SideBar
                setFriends={setFriends}
                setMessages={setCurrentMessages}
                setChat={setChat}
                setLoadMore={setLoadMore}
            />
            {!chat ? (
                <div className="flex justify-center items-center w-full h-screen ">
                    Search a friends name and start chating!
                </div>
            ) : (
                <div className="flex flex-col gap-2 w-full py-2 rounded-md h-screen">
                    {chat && (
                        <div className="p-2">
                            <div className="border rounded-lg flex gap-2 items-start py-2 px-2">
                                <img
                                    src={chat.avatar || "q.jpg"}
                                    alt="img"
                                    className={`rounded-full h-9 w-9`}
                                    onError={(e) =>
                                        (e.currentTarget.src = "q.jpg")
                                    }
                                />
                                <div className="flex flex-col justify-between">
                                    {chat.isGroup ? (
                                        <UpdateGroup
                                            setChat={setChat}
                                            header="Edit Group info"
                                            description="Edit Group info"
                                            chat={chat}
                                            friends={friends}
                                        >
                                            <button className="hover:underline cursor-pointer text-start font-semibold leading-5">
                                                chat.name
                                            </button>
                                        </UpdateGroup>
                                    ) : (
                                        <p
                                            className="hover:underline cursor-pointer text-start font-semibold leading-5"
                                            onClick={() =>
                                                setFriendInfoSidebarOpen(true)
                                            }
                                        >
                                            {chat.participants[0]?.userName}
                                        </p>
                                    )}
                                    <div className="flex justify-between items-center">
                                        {chat.isGroup ? (
                                            <p className="text-[9px] text-gray-500 text-sm">
                                                group chat
                                            </p>
                                        ) : (
                                            <p className="text-[9px] text-gray-400">
                                                {" "}
                                                <span className="dark:text-gray-200">
                                                    Last online:
                                                </span>{" "}
                                                {new Date(
                                                    chat.participants[0].lastOnline
                                                ).toLocaleDateString()}
                                                ,{" "}
                                                {new Date(
                                                    chat.participants[0].lastOnline
                                                ).toLocaleTimeString()}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className=" flex h-screen overflow-hidden">
                        <div
                            className={`h-full transition-all ease-linear ${
                                !friendInfoSidebarOpen ? "w-full" : "w-[65%]"
                            }`}
                        >
                            <div
                                className="h-[91%] flex flex-col overflow-y-auto justify-start items-center pb-6"
                                ref={messagesContainerRef}
                            >
                                {currentMessages.length > 0 && loadMore && (
                                    <Button
                                        variant="ghost"
                                        onClick={loadMoreChats}
                                    >
                                        Load more
                                    </Button>
                                )}
                                {currentMessages.length ? (
                                    currentMessages?.map(
                                        (message: string, index: number) => {
                                            return (
                                                <MessageContainer
                                                    message={message}
                                                    key={index}
                                                    isGroup={chat.isGroup}
                                                />
                                            );
                                        }
                                    )
                                ) : (
                                    <div className="w-full h-full flex justify-center items-center">
                                        No message yet!
                                    </div>
                                )}
                                {typing && (
                                    <div className="px-4 self-start flex animate-bounce">
                                        Typing...
                                    </div>
                                )}
                            </div>
                            <form
                                className="flex items-center gap-1 justify-center relative px-2
                                border-0 text-primary-foreground [background-clip:padding-box,border-box,border-box] [background-origin:border-box] [border:calc(0.125rem)_solid_transparent] before:absolute before:top-[0%] before:left-1/2 before:z-0 before:h-1/5 before:w-3/5 before:-translate-x-1/2 before:animate-rainbow before:bg-[linear-gradient(90deg,var(--color-1),var(--color-5),var(--color-3),var(--color-4),var(--color-2))] before:[filter:blur(0.75rem)]"
                            >
                                <input
                                    className="w-3/4 p-2 rounded-md border dark:bg-black bg-gray-300 dark:text-white text-black relative z-2"
                                    placeholder="Type here..."
                                    {...register("message")}
                                    onChange={(e) => keyPressed(e)}
                                />
                                <Button
                                    className="relative "
                                    variant="ghost"
                                    onClick={handleSubmit(submit)}
                                >
                                    <SendHorizonal
                                        size={64}
                                        className="dark:text-white text-black"
                                    />
                                </Button>
                                {/* </div> */}
                            </form>
                        </div>
                        {friendInfoSidebarOpen && (
                            <section className=" p-2 flex justify-center items-start border w-[35%] rounded-lg overscroll-y-auto h-screen">
                                <div className="w-full relative pt-4 p-2">
                                <XCircle
                                    className="ml-auto cursor-pointer absolute top-2 right-2"
                                    onClick={() =>
                                        setFriendInfoSidebarOpen(false)
                                    }
                                />
                                <div className="border rounded-lg p-1 space-y-1">
                                    <div className="flex flex-col items-center justify-center border rounded-lg p-1">
                                        <img src="./q.jpg" alt=""  className="size-36 rounded-full"/>
                                        <p className="text-2xl font-semibold">{chat.participants[0]?.userName}</p>
                                    </div>
                                    <div className="flex flex-col border rounded-lg gap-1 p-2">
                                        <h4 className="font-bold text-center text-lg">Details</h4>
                                        {
                                            [{
                                                key:'Description',
                                                value:chat.participants[0]?.description
                                            },
                                        {
                                            key:'Email',
                                            value:chat.participants[0]?.email

                                        },{
                                            key:"Last online",
                                            value:`${new Date(chat.participants[0].lastOnline).toLocaleDateString()}, ${
                                                new Date(
                                                    chat.participants[0].lastOnline
                                                ).toLocaleTimeString()}`
                                        }].map((x,index)=>{
                                            return(
                                            <div key={index} className="flex flex-col p-1 gap-1 rounded-lg dark:bg-black/20 bg-white">
                                                <p className="leading-none font-semibold text-xs">{x.key}</p>
                                                <p className="">{x.value}</p>
                                            </div>
                                            )
                                          })
                                        }
                                    </div>
                                    <div className="flex justify-center items-center gap-2">
                                        <Button variant="outline" onClick={deleteChat}>Delete Chat</Button>
                                        <Button variant="destructive" onClick={removeFriend}>Remove friend</Button>
                                    </div>
                                </div>
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Chat;
