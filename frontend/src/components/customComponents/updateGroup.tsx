import { ReactNode, useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useUser } from "@/context/session";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
type Props = {
    children: ReactNode;
    friends: any;
    header:string;
    description:string;
    chat:any;
    setChat:any
};

function UpdateGroup({ children, friends, header, description, chat, setChat }: Props) {
    const { user } = useUser() as any;
    console.log(chat);
    const [groupParticipants,setGroupParticipants] = useState<any>([]);
    const {register, handleSubmit ,formState:{errors},setValue} = useForm({
        defaultValues:{
            name:chat.name
        }
    });

    const chatParticipants = (chat.participants).filter((c:any)=>c.userName!==user.userName).map((c:any)=>c._id);
    useEffect(()=>{
        setGroupParticipants(chatParticipants);
    },[])
    const allFriends = friends.map((f:any)=>{
        let r;
        if(f.participants[0].userName==user.userName)r=f.participants[1]
        else r=f.participants[0]
        return r;
    })

    const addToGroup= async(e:any,f:any)=>{
        if(e.target.checked){
            setGroupParticipants((prev:any)=>[...prev,f._id]);
        }else{
            setGroupParticipants((prev:any)=>{
                const removed = prev.filter((x:any)=>x !== f._id);
                return removed;
            })
        }
    }
    
    const submit = async(data:any)=>{
        try {
            const res = await axios.post(`${import.meta.env.VITE_URL}/api/chat/update-group-info`,{
                id:chat._id,
                name:data.name,
                users:groupParticipants
            },{withCredentials:true});
            setGroupParticipants([]);
            console.log(res);
            setChat(res.data?.data);
        } catch (error) {
            const ae = error as AxiosError<any>;
            toast.error(ae.response?.data.message);
        }
    }
    const isAlreadyInGroup = (friend:any) => {
        const g = groupParticipants.some((participant:any) => {
            return participant === friend._id;
        });
        return g
    }

    return (
        <Dialog>
            <DialogTrigger asChild className="">{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{header}</DialogTitle>
                    <DialogDescription className="text-wrap">
                        {description}
                    </DialogDescription>
                </DialogHeader>
                    <form onSubmit={handleSubmit(submit)}>
                        <div className="flex flex-col">

                        <label htmlFor="name">
                        Group name 
                        </label>
                        <input type="text" className="border p-2 rounded-md" id="name" {...register('name',{
                            required:'Group name is required'
                        })}/>
                        {errors.name && <p className="text-red-600">{errors.name.message as string}</p>}
                        </div>
                <div>
                    <p className="pt-4 pb-1">Select group members</p>
                    {allFriends && allFriends.map((friend:any) => {
                        return (
                            <label className="flex items-center space-x-4 p-2 border rounded-md mb-1" key={friend._id}>
                                <input className="" type="checkbox" onChange={(event)=>addToGroup(event,friend)}
                                checked={isAlreadyInGroup(friend)}
                                />
                                <span>{friend.userName}</span>
                                
                            </label>
                        );
                    })}
                </div>
                <DialogFooter>
                    <button className="px-4 py-2 rounded-md border">update</button>
                </DialogFooter>
                    </form>
            </DialogContent>
        </Dialog>
    );
}

export default UpdateGroup;
