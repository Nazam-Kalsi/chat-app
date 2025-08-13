import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "sonner";

// shadcn / shadcn-ui components
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Loading from "@/components/customComponents/loading";
import { useUser } from "@/context/session";

type UserProfile = {
  _id?: string;
  userName: string;
  email: string;
  description: string;
  avatar?: any;
};

export default function Profile() {
    const user = useUser();
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset, watch, formState, setValue } = useForm({
    defaultValues: { userName: "", email: "", description: "", avatar: undefined as FileList | undefined },
  });
  useEffect(()=>{
    if(user.user){
      setValue("userName", user.user.userName );
      setValue("email", user?.user?.email);
      setValue("description", user?.user?.description );
    }
  },[user])

  // save handler
  const onSubmit = async (values: UserProfile) => {
    console.log(values)
    try {
      setSaving(true);
      const res = await axios.patch(`${import.meta.env.VITE_URL || ""}/api/user/update-user`, values, { withCredentials: true });
      reset(res.data?.data ?? values);
      toast.success("Profile saved");
    } catch (e) {
      console.error(e);
      toast.error("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };
  // console.log("user:",user);
  return (
    <div className="min-h-screen flex justify-center items-center ">
    <Card className="min-w-1/2">
      <CardHeader>
        <CardTitle className="uppercase text-center">User profile</CardTitle>
      </CardHeader>

      <CardContent>
        
          <form id="profile-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="id">ID</Label>
              <input className="w-full border rounded-md p-2"  id="id" value={user?.user?._id ?? ""} readOnly/>
            </div>

            {/* Name */}
            <div>
              <Label htmlFor="name">Name</Label>
              <input className="w-full border rounded-md p-2" id="name" placeholder="Full name" {...register("userName", { required: "Name is required" })} />
              {formState.errors.userName && (
                <p className="text-sm text-red-600">{formState.errors.userName.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email">Email</Label>
              <input className="w-full border rounded-md p-2" id="email" placeholder="you@domain.com" {...register("email", {
                required: "Email is required",
                pattern: { value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/, message: "Invalid email" },
              })} />
              {formState.errors.email && (
                <p className="text-sm text-red-600">{formState.errors.email.message}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description</Label>
              <textarea id="description" placeholder="A short bio" {...register("description")} className="w-full border rounded-md px-2"/>
            </div>

            {/* Avatar URL */}
            <div>
              <Label htmlFor="avatar">Avatar (URL)</Label>
              <input
                type="file"
                accept="image/png, image/jpeg"
                className="w-full border rounded-md p-2"
                id="avatar"
                {...register("avatar")}
              />
              {(watch("avatar") && (watch("avatar") as FileList).length > 0)&& (
                <div className="mt-2">
                  <img
                    src={URL.createObjectURL((watch("avatar") as FileList)[0] as File)}
                    alt="avatar preview"
                    className="w-24 h-24 rounded-full object-cover border"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/q.jpg"; }}
                  />
                </div>
              )}
            </div>
          </form>
        
      </CardContent>

      <CardFooter className="flex justify-end space-x-2">
        <Button form="profile-form" type="submit">
          {saving ? "Saving..." : "Save"}
        </Button>
      </CardFooter>
    </Card>
    </div>
  );
}
