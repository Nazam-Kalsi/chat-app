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
import axios from "axios";
import {socket} from '../socket'
function Chat() {
    const messagesContainerRef = useRef<HTMLDivElement | null>(null);
    const [currentMessages, setCurrentMessages] = useState<any>([]);
    const [chat,setChat] = useState<any>();
    const [userSocketId,setUserSocketId] = useState<string>('');
    const navigate = useNavigate();
    const {user,setUser} = useUser() as any;
    // if(!user){
    //     navigate('/sign-in');
    // }

    
    
    socket.on("welcome", (arg) => {
        setUserSocketId(arg);
        ;(async()=>{try {
            const res = await axios.patch(`${import.meta.env.VITE_URL}/api/user/update-user`,{
                socketId:arg
            },{
                withCredentials:true
            });
            console.log("Update socket id in db : ",res);
            if(!res) throw new Error;
            setUser(res.data.data);
           } catch (error) {
                console.log(error);
           }})();
        console.log(arg);
    });

    socket.on('message',(m)=>{
        console.log("message recieved : ",m,user);
        setCurrentMessages([...currentMessages, {message:m.message, sender:m.sender, createdAt:new Date()}]);
    })
    
    const { register, handleSubmit,setValue } = useForm<z.infer<typeof chatSchema>>({
        resolver: zodResolver(chatSchema),
        defaultValues: {
            message: "",
        },
    });

    useEffect(()=>{
        if(messagesContainerRef.current){
            messagesContainerRef.current.scrollTo({
                top: messagesContainerRef.current.scrollHeight,
                behavior: 'smooth',
              });
        }
    },[currentMessages])

    const submit = async (data: z.infer<typeof chatSchema>) => {
        console.log(data,user);
        setCurrentMessages([...currentMessages, {message:data.message, sender:user._id, createdAt:new Date()}]);
        try{
            const res = await axios.post(`${import.meta.env.VITE_URL}/api/message/send-message/${chat._id}`,
                {messageContent:data.message},{withCredentials:true}
            )
            if(res){
                socket.emit('send-message',{message:data.message, sender:user._id});
            }
        }catch(error){console.log(error)}
        setValue('message','');
    };
    // console.log("currentMessages : ",currentMessages,chat);
    // console.log("user in chat : ",user);

    return (
        <div className="flex px-2">
            <SideBar setMessages={setCurrentMessages} setChat={setChat}/>
            <div className="flex flex-col gap-2 w-full p-2 rounded-md h-[35rem]">
                <div className=" h-[100vh] flex flex-col overflow-y-auto" ref={messagesContainerRef}>
                    {currentMessages && currentMessages?.map((message:string,index:number) => {
                        return <MessageContainer message={message} key={index} />;
                    })}
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
