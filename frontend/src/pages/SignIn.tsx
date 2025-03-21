import { cn } from "../lib/utils"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { Label } from "../components/ui/label"
import { Link, useNavigate } from "react-router"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { userSchema } from "@/schema/user.schema"
import { useUser } from "@/context/session"

export default function SignIn() {

  const navigate = useNavigate();
  const {user,setUser} = useUser();
  const {register, handleSubmit, formState:{errors}} = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema)
  });

  const submit = async(data:z.infer<typeof userSchema>)=>{

try {
      const res = await fetch(`http://localhost:3000/api/user/sign-in`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      const d = await res.json();
      console.log(d);
      setUser(d.data);
      navigate('/');
} catch (error) {
  console.log(error);
}
  }

  return (
    <div className={cn("flex flex-col gap-6 ")}>
      <Card className="overflow-hidden p-0 w-8/12 mx-auto">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit(submit)}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground text-balance">
                  Login to your account
                </p>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <input
                  id="email"
                  type="text"
                  {...register('userName')}
                  // placeholder="m@example.com"
                  required
                />
                {errors.userName && <span className="text-red-700">{errors.userName.message}</span>}
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <input 
                id="password"
                 type="password"
                  required
                  {...register('password')}
                  />
                  {errors.password && <span className="text-red-700">{errors.password.message}</span>}
              </div>
              <Button variant='default' type="submit" className="w-full">
                Login
              </Button>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link className="hover:underline" to="/sign-up"> Sign Up </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}
