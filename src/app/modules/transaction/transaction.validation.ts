import z from "zod";
import { IStatus, IType } from "./transaction.interface";

export const createTransactionZodSchema = z.object({
    types : z.enum(IType),
    amount : z.number().positive(),
    fee : z.number().min(0).optional(),
    commission:z.number().positive().optional(),
    status : z.enum(IStatus).optional(),
    description:z.string().optional(),
    senderWallet : z.string().optional(),
    receiverWallet:z.string().optional()

})