import {z} from 'zod';

export const userSchema = z.object({
    userName:z.string().min(3,'Username must be at least 3 characters long'),
    password:z.string().min(4,"Password must be at least 4 characters long"),
})