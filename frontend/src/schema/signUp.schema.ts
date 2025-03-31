import {z} from 'zod';

export const signUpSchema = z.object({
    userName:z.string().min(3,'Username must be at least 3 characters long')
    .regex(new RegExp('^(?!.*@).+$'),"Username cannot contain '@'"),
    email:z.string().email('Invalid email address'),
    password:z.string().min(4,"Password must be at least 4 characters long"),
})