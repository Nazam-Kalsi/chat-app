import Loading from "@/components/customComponents/loading";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link, useNavigate } from "react-router";
import { toast } from "sonner"
import { useForm } from "react-hook-form";
import { signUpSchema } from "@/schema/signUp.schema";
import {z} from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { useDebounceValue } from "usehooks-ts";
import { Loader2 } from "lucide-react";

export default function Signup() {
  const [l,setL] = useState<boolean>(false);

  const [debouncedValue, setValue] = useDebounceValue('', 900)
  const [userNameAvailableIndicator, setUserNameAvailableIndicator] = useState<{
    message: string | null;
    status: boolean;
    loading:boolean
  }>({ message: null, status: false, loading:false });
  const navigate = useNavigate();
  const {register, handleSubmit, watch, formState:{errors}} = useForm({
    resolver:zodResolver(signUpSchema),
    defaultValues:{
      userName:'',
      password:'',
      email:''
    }
  });

  const watchedUserName = watch('userName');

  useEffect(()=>{
    setValue(watchedUserName);
    if(!watchedUserName.length){
      setUserNameAvailableIndicator({
        message:null,
        status:false,
        loading:false
      }) 
    }else{
      setUserNameAvailableIndicator({
        message:null,
        status:false,
        loading:true
      }) 
    }

  },[watchedUserName])

  useEffect(()=>{ 
    ;(async()=>{
      try {
        console.log(debouncedValue);
        if(debouncedValue.length){
          const res = await fetch(`${import.meta.env.VITE_URL}/api/user/check-userName`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userName:debouncedValue
          }),
        });
        const data = await res.json();
        if(!res.ok){
          console.log(data.message);
          setUserNameAvailableIndicator({
            message:data.message,
            status:false,
            loading:false
          })       
          return;
        }
        setUserNameAvailableIndicator({
          message:data.message,
          status:true,
          loading:false
        })       
      }
    } catch (error) {
    }finally{
      }
    })();
  },[debouncedValue])
  const submit = async (data:z.infer<typeof signUpSchema>) => {
    setL(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_URL}/api/user/sign-up`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      console.log(res)
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message);
      }
      navigate('/sign-in')
    } catch (error:any) {
     toast.error(error.message);
    }finally{
      setL(false);
    }
  };
  return (

    <div className="grid min-h-svh lg:grid-cols-2">
      { l && <Loading/>}
    <div className="flex flex-col gap-4 p-6 md:p-10">
      <div className="flex justify-center gap-2 md:justify-start">
        {/* <a href="#" className="flex items-center gap-2 font-medium">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Acme Inc.
        </a> */}
      </div>
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-xs">
        <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Create your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your credentials below to create your account
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="name">Name</Label>
          <input className="p-2 border rounded-md" id="name" type="text" placeholder="" {...register('userName')}/>
          {errors.userName && <p className="text-red-600">{errors.userName.message}</p> }
          {!errors.userName && (userNameAvailableIndicator.message)? 
          <p className={`${userNameAvailableIndicator.status?"text-green-600":"text-red-700"}`}>{userNameAvailableIndicator.message}</p> 
           : (userNameAvailableIndicator.loading)?<Loader2 className="animate-spin"/> : '' } 
        </div>
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <input id="email" className="p-2 border rounded-md" type="email" placeholder="m@example.com" {...register('email')} />
          {errors.email && <p className="text-red-600">{errors.email.message}</p> }
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>          
          </div>
          <input id="password" className="p-2 border rounded-md" type="password" placeholder="********" {...register('password')}/>
          {errors.password && <p className="text-red-600">{errors.password.message}</p> }
        </div>
        <Button type="submit" className="w-full">
          Create Account
        </Button>
      </div>
      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link to="/sign-in" className="underline underline-offset-4">
          log in
        </Link>
      </div>
    </form>
        </div>
      </div>
    </div>
    <div className="relative hidden bg-muted lg:block">
      {/* <img
        src="/placeholder.svg"
        alt="Image"
        className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
      /> */}
    </div>
  </div>
  );
}
