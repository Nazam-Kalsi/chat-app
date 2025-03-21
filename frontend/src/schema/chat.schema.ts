import { z } from 'zod';

export const chatSchema = z.object({
    message: z.string().min(1, "You can't send empty message.")
});
