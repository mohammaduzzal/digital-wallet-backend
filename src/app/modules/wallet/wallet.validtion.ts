import z from "zod";

export const updateWalletSchema = z.object({
    balance: z.number().positive().optional(),
    isBlocked: z.boolean({ error: "isBlocked must be true or false" }).optional()
})