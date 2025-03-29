import React, { ReactNode, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
};

function GroupDialog({ children, friends }: Props) {
    const { user } = useUser() as any;
    const [groupParticipants,setGroupParticipants] = useState<any>([]);
    const {register, handleSubmit ,formState:{errors}, setValue} = useForm();

    const friendsData = friends.map((f: any) => {
        const friendsData =
            f.participants[0].userName === user.userName
                ? f.participants[1]
                : f.participants[0];
        return friendsData;
    });

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
        console.log(data);
        console.log(groupParticipants);
        try {
            const res = await axios.post(`${import.meta.env.VITE_URL}/api/chat/create-group-chat`,
                {name:data.name,users:groupParticipants},
                {withCredentials:true});

            console.log(res);
            setGroupParticipants([]);
        } catch (error) {
            const ae = error as AxiosError<any>;
            toast.error(ae.response?.data.message);
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild className="absolute bottom-0 right-2">{children}</DialogTrigger>
            <DialogContent className="">
                <DialogHeader>
                    <DialogTitle>Create a group</DialogTitle>
                    <DialogDescription className="text-wrap">
                        Mark the friends to add in a group.
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
                    {friendsData && friendsData.map((friend:any) => {
                        return (
                            <label className="flex items-center space-x-4 p-2 border rounded-md mb-1" key={friend._id}>
                                <input className="" type="checkbox" onClick={(event)=>addToGroup(event,friend)}/>
                                {/* <input  type="checkbox" {...register(friend.userName)}/> */}
                                <span>{friend.userName}</span>
                            </label>
                        );
                    })}
                </div>
                <DialogFooter>
                    <button className="px-4 py-2 rounded-md border">Create</button>
                </DialogFooter>
                    </form>
            </DialogContent>
        </Dialog>
    );
}

export default GroupDialog;
