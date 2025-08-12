import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "sonner";

// shadcn / shadcn-ui components
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Loading from "@/components/customComponents/loading";
import { useUser } from "@/context/session";

type UserProfile = {
  _id?: string;
  name: string;
  email: string;
  description?: string;
  avatar?: string;
};

export default function Profile() {
    const user = useUser();
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset, watch, formState,setValue } = useForm<UserProfile>({
    defaultValues: { name: "", email: "", description: "", avatar: "" },
  });
useEffect(()=>{
    setValue(name,user?.user?.name)

},[user])

  // save handler
  const onSubmit = async (values: UserProfile) => {
    try {
      setSaving(true);
      const res = await axios.put(`${import.meta.env.VITE_URL || ""}/api/user/profile`, values, { withCredentials: true });
      reset(res.data?.data ?? values);
      toast.success("Profile saved");
    } catch (e) {
      console.error(e);
      toast.error("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };
  console.log(user);
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
              <Input id="id" value={user?.user?._id ?? ""} readOnly/>
            </div>

            {/* Name */}
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Full name" {...register("name", { required: "Name is required" })} />
              {formState.errors.name && (
                <p className="text-sm text-red-600">{formState.errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" placeholder="you@domain.com" {...register("email", {
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
              <Input id="avatar" placeholder="https://...jpg" {...register("avatar")} />
              {watch("avatar") && (
                <div className="mt-2">
                  <img
                    src={watch("avatar")}
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
