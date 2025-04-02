import {z} from 'zod';

export const signUpSchema = z.object({
    userName:z.string().min(3,'Username must be at least 3 characters long')
    .regex(new RegExp('^(?!.*@).+$'),"Username cannot contain '@'"),
    email:z.string().email('Invalid email address'),
    password:z.string().min(4,"Password must be at least 4 characters long"),
    avatar:z.instanceof(FileList)
            .refine((fileList) => 
                fileList[0] instanceof File, 
                {message:"Profile pic is required"})
            .refine((fileList) => 
                fileList[0] instanceof File && [
                    "image/png",
                    "image/jpeg",
                    "image/jpg",
                ].includes(fileList[0].type), 
                {message:"The image must be of jpg, jpeg and png"}),
       
})