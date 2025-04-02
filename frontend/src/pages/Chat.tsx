import { useRef, useState, useEffect } from "react";
import { useUser } from "@/context/session";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { chatSchema } from "@/schema/chat.schema";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { SendHorizonal } from "lucide-react";
import MessageContainer from "@/components/customComponents/messageContainer";
import SideBar from "@/components/customComponents/sideBar";
import axios from "axios";
import { socket } from "../socket";
import { toast } from "sonner";
import UpdateGroup from "@/components/customComponents/updateGroup";
function Chat() {
    const messagesContainerRef = useRef<HTMLDivElement | null>(null);
    const [currentMessages, setCurrentMessages] = useState<any>([]);
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
        if (!loading && user === null) {
            navigate("/sign-in");
        }
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
                    to:
                        user._id === chat.participants[1]._id
                            ? chat.participants[0]._id
                            : chat.participants[1]._id,
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
            to:
                user._id === chat.participants[1]._id
                    ? chat.participants[0]._id
                    : chat.participants[1]._id,
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
                        <div className="border-b flex gap-2 items-start pb-2 px-2">
                                <img src={chat.avatar || "q.jpg"}
                                     alt="img"
                                     className={`rounded-full h-9 w-9`}
                                     onError={(e) => (e.currentTarget.src = "q.jpg")}/>
                            <div>
                                <UpdateGroup
                                setChat={setChat}
                                header="Edit Group info"
                                description="Edit Group info"
                                chat={chat}
                                friends={friends}>
                                <button className="hover:underline cursor-pointer text-start font-semibold leading-5">
                                    {chat.isGroup
                                        ? chat.name
                                        : user?.userName ===
                                          chat.participants[0]?.userName
                                        ? chat.participants[1].userName
                                        : chat.participants[0]?.userName}
                                </button>
                                </UpdateGroup>
                                <div className="flex justify-between items-center">
                                    {chat.isGroup && (
                                        <p className="text-gray-500 text-sm">
                                            group chat
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                    <div
                        className="relative h-[100vh] flex flex-col overflow-y-auto justify-start items-center pb-6"
                        ref={messagesContainerRef}
                    >
                        {currentMessages.length > 0 && loadMore && (
                            <Button variant="ghost" onClick={loadMoreChats}>
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
                    <form className="flex relative px-2">
                        <input
                            className=" w-full outline-1 border-gray-300 p-2 rounded-md"
                            placeholder="Type here..."
                            {...register("message")}
                            onChange={(e) => keyPressed(e)}
                        />
                        <Button
                            variant="ghost"
                            className="absolute right-1 top-[2px]"
                            onClick={handleSubmit(submit)}
                        >
                            <SendHorizonal size={64} />
                        </Button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default Chat;
