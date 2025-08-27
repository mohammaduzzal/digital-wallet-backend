import z from "zod";
import { IStatus, IType } from "./transaction.interface";

export const createTransactionZodSchema = z.object({
    types : z.enum(Object.values(IType) as [string,...string[]]),
    amount : z.number().positive(),
    fee : z.number().min(0).optional(),
    commission:z.number().min(0).optional(),
    status : z.enum(Object.values(IStatus)as [string,...string[]]).optional(),
    description:z.string().optional(),
    senderWallet : z.string().optional(),
    receiverWallet:z.string().optional(),
    senderEmail : z.string().optional(),
    receiverEmail : z.string().optional()

})