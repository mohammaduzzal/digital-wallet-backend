import z from "zod";

export const updateWalletSchema = z.object({
 isBlocked : z.boolean({error : "isBlocked must be true or false"})
})