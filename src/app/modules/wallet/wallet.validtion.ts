import z from "zod";

export const updateWalletSchema = z.object({
    balance : z.number({error:"balance must be number"})
    .min(10,{message : "balance must be  at least 10 BDT"}).optional(),

    isBlocked : z.boolean({error : "isBlocked must be true or false"}).optional()
})