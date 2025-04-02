import { cn } from "../lib/utils"
import { Button } from "../components/ui/button"
import { Label } from "../components/ui/label"
import { Link, useNavigate } from "react-router"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { userSchema } from "@/schema/user.schema"
import { useUser } from "@/context/session"
import { toast } from "sonner"
import { useState } from "react"
import Loading from "@/components/customComponents/loading"
import { useGoogleLogin } from "@react-oauth/google"
export default function SignIn() {

  const navigate = useNavigate();
  const [l, setL] = useState<boolean>(false);
  const {setUser,setLoading} = useUser();
  const {register, handleSubmit, formState:{errors}} = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: 'test@test.com',
      password: "test",
    },
  });

  const submit = async(data:z.infer<typeof userSchema>)=>{

try {
  setL(true);
      const res = await fetch(`${import.meta.env.VITE_URL}/api/user/sign-in`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      console.log(res)
      if(!res || !res.ok){
        const errorData = await res.json();
        console.log(errorData)
        throw new Error(errorData.message);
      }
      console.log(res);
      const d = await res.json();
      setUser(d.data);
      setLoading(false);
      navigate('/');
} catch (error:any) {
  console.log(error.message);
  toast.error(error.message);
}finally{
  setL(false);
}
  }

  const googleSignIn = useGoogleLogin({
    onSuccess: async ( d:any ) => {
        try {
            const res = await fetch(
                `${import.meta.env.VITE_URL}/api/user/google-sign-up`,{
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials:'include',
                    body: JSON.stringify(d),
                  });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            console.log(data);
            setUser(data.data);
            navigate('/')
        } catch (error) {
            console.log("error while google login : ", error);
        }
    },
});

  return (
    <>
      {l && <Loading/>}
    <div className={cn("flex flex-col gap-6 w-10/12 sm:w-8/12 lg:w-4/12  mx-auto h-screen justify-center")}>
      {/* <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2"> */}
        <div className="dark:bg-black/50 rounded-lg p-0 overflow-hidden border">        
          <form className="p-6 md:p-8" onSubmit={handleSubmit(submit)}>
            <div className="flex flex-col gap-6 w-full">
              <div className="flex flex-col items-center text-center w-full">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground text-balance">
                  Login to your account
                </p>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email/Username</Label>
                <input
                  id="email"
                   className="border p-2 w-full rounded-md"
                  type="text"
                  {...register('name')}
                  placeholder=""
                  required
                />
                {errors.name && <span className="text-red-700">{errors.name.message}</span>}
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <input 
                id="password"
                 className="border p-2 w-full rounded-md"
                 type="password"
                  required
                  {...register('password')}
                  />
                  {errors.password && <span className="text-red-700">{errors.password.message}</span>}
              </div>
              <Button variant='default' type="submit" className="w-full">
                Login
              </Button>
              <Button variant='outline' onClick={(e)=>{e.preventDefault(); googleSignIn()}}>Log-in with Google</Button>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link className="hover:underline" to="/sign-up"> Sign Up </Link>
              </div>
            </div>
          </form>
          </div>
        {/* </CardContent>
      </Card> */}
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
    </>
  )
}
