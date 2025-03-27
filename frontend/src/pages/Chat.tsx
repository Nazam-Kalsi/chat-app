import { useRef, useState, RefObject, useEffect } from "react";
import { useUser } from "@/context/session";
import { useNavigate } from "react-router";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { chatSchema } from "@/schema/chat.schema";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { SendHorizonal } from "lucide-react";
import MessageContainer from "@/components/customComponents/messageContainer";
import SideBar from "@/components/customComponents/sideBar";
import axios, { Axios, AxiosResponse } from "axios";
import { socket } from "../socket";
import { toast } from "sonner";
function Chat() {
    const messagesContainerRef = useRef<HTMLDivElement | null>(null);
    const [currentMessages, setCurrentMessages] = useState<any>([]);
    const [chat, setChat] = useState<any>();
    const [page, setPage] = useState<number>(2);
    const [limit, setLimit] = useState<number>(10);
    const [loadMore, setLoadMore] = useState<boolean>(true);
    // const [userSocketId, setUserSocketId] = useState<string>("");
    const navigate = useNavigate();
    const { user, loading } = useUser() as any;

    useEffect(() => {
        console.log("from useuser : ", user);
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
        console.log(data);
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
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTo({
                top: messagesContainerRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [currentMessages]);

    const submit = async (data: z.infer<typeof chatSchema>) => {
        console.log(data, user);
        setCurrentMessages([
            ...currentMessages,
            { message: data.message, sender: user?._id, createdAt: new Date() },
        ]);
        try {
            socket.emit("private-chat", {
                to:
                    user._id === chat.participants[1]._id
                        ? chat.participants[0]._id
                        : chat.participants[1]._id,
                message: data.message,
            });
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

    const loadMoreChats = async()=>{
        console.log('clicked')
        try {
            // setPage((prev:number)=>prev+1);
        } catch (error) {
            
        }
    }

    return (
        <div className="flex px-2">
            <SideBar setMessages={setCurrentMessages} setChat={setChat} setPage={setPage}/>
            <div className="flex flex-col gap-2 w-full p-2 rounded-md h-[35rem]">
                <div
                    className=" h-[100vh] flex flex-col overflow-y-auto"
                    ref={messagesContainerRef}
                >
                    {currentMessages.length > 0 && <Button variant='ghost' onClick={loadMoreChats}>Load more</Button>}
                    {currentMessages.length ? (
                        currentMessages?.map(
                            (message: string, index: number) => {
                                return (
                                    <MessageContainer
                                        message={message}
                                        key={index}
                                    />
                                );
                            }
                        )
                    ) : (
                        <div className="w-full h-full flex justify-center items-center">
                            No message yet!
                        </div>
                    )}
                </div>
                <form className="flex relative">
                    <input
                        className=" w-full outline-1 border-gray-300 p-2 rounded-md"
                        placeholder="Type here..."
                        {...register("message")}
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
        </div>
    );
}

export default Chat;
