import axios, { AxiosError } from "axios";
import { ArrowBigDownDash, Loader2, UserPlus2Icon, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
    user: any;
    setOpen:(v:boolean)=>void;
    setFriends:any;

};

function SearchModal({ user, setOpen, setFriends }: Props) {

const addFriend = async (user: any) => {
    try {
        const res = await axios.post(
            `${import.meta.env.VITE_URL}/api/chat/create-chat/${user._id}`,
            {},
            {withCredentials: true}
        );
        console.log(res);
        setFriends((prev:any)=>[...prev,res.data.data]);
    } catch (error:any) {
        const axiosError = error as AxiosError<any>;
        toast.info(axiosError?.response?.data.message)
    }
    finally{
        setOpen(false);
    }
};
    return (
        <div className="flex flex-col p-2 absolute border isolate bg-white/50 dark:bg-black/50 shadow-lg ring-1 ring-black/5 w-full top-16  rounded-lg backdrop-blur-xs">
            <div className="flex justify-between items-center p-2">
            <h5>Add friends</h5>
            <XCircle className="self-end" strokeWidth={0.9} onClick={()=>setOpen(false)}/>
            </div>
            {user.loading ? <Loader2 className="animate-spin self-center"/>:
            <div>
            {user.user.map((u: any,index:number) => {
                return (
                    <button key={index} onClick={() => addFriend(u)} className="w-full p-2 hover:bg-white/10 rounded-md">
                         <p className=" flex w-full items-start justify-between">
                         {u.userName}
                         <UserPlus2Icon strokeWidth={0.9}/>
                         </p>
                    </button>
                );
            })}
            </div>
            }
        </div>
    );
}

export default SearchModal;
