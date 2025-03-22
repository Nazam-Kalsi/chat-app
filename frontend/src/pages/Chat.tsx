import { useState } from "react";
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

function Chat() {
    // const navigate = useNavigate();
    const {user} = useUser() as any;
    // if(!user){
    //     navigate('/sign-in');
    // }
    // console.log(user);
    const [currentMessages, setCurrentMessages] = useState<any>([]);
    const [chat,setChat] = useState<any>();
    const { register, handleSubmit,setValue } = useForm<z.infer<typeof chatSchema>>({
        resolver: zodResolver(chatSchema),
        defaultValues: {
            message: "",
        },
    });

    const submit = async (data: z.infer<typeof chatSchema>) => {
        console.log(data);
        setCurrentMessages([...currentMessages, {message:data.message, sender:user._id, createdAt:new Date()}]);
        try{
            const res = await axios.post(`${import.meta.env.VITE_URL}/api/message/send-message/${chat._id}`,
                {messageContent:data.message},{withCredentials:true}
            )
        }catch(error){console.log(error)}
        setValue('message','');
    };
    console.log("currentMessages : ",currentMessages,chat);

    return (
        <div className="flex px-2">
            <SideBar setMessages={setCurrentMessages} setChat={setChat}/>
            <div className="flex flex-col gap-2 w-full p-2 rounded-md h-[35rem]">
                <div className="h-full flex flex-col">
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
