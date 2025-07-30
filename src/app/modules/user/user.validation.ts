import z from "zod";
import { Role } from "./user.interface";

export const createUserZodSchema = z.object({

    name: z.string({ error: "name must be string" }).min(2, { message: "name is too short.minimum 2 character long" }).max(50, { message: "name is too long.maximum 50 character long" }),

    email: z.email({ error: "invalid email address format" })
        .min(5, { message: "email must be at least 5 characters long" })
        .max(100, { message: "email cannot exceed 100 characters" }),

    password: z.string().min(8)
        .regex(/^(?=.*[A-Z])/, {
            message: "password must contain at least 1 uppercase",
        })
        .regex(/^(?=.*[!@#$%^&*])/, {
            message: "password must contain at least 1 special character",
        })
        .regex(/^(?=.*\d)/, {
            message: "password must contain at least 1 number",
        }),

    phoneNumber: z.
        string({ error: "phone number must be string" })
        .regex(/^(?:\+8801\d{9})$/, {
            message: "phone number must valid for bangladesh.format: +8801XXXXXXXXX or 01XXXXXXXXX"
        }).optional()



})


export const updateUserZodSchema = z.object({

    name: z.string({ error: "name must be string" }).min(2, { message: "name is too short.minimum 2 character long" }).max(50, { message: "name is too long.maximum 50 character long" }).optional(),


    password: z.string().min(8)
        .regex(/^(?=.*[A-Z])/, {
            message: "password must contain at least 1 uppercase",
        })
        .regex(/^(?=.*[!@#$%^&*])/, {
            message: "password must contain at least 1 special character",
        })
        .regex(/^(?=.*\d)/, {
            message: "password must contain at least 1 number",
        }).optional(),

    phoneNumber: z.
        string({ error: "phone number must be string" })
        .regex(/^(?:\+8801\d{9})$/, {
            message: "phone number must valid for bangladesh.format: +8801XXXXXXXXX or 01XXXXXXXXX"
        }).optional(),
    isApproved: z.boolean({ error: "isApproved must be true or false" }).optional(),

    role: z.enum(Object.values(Role) as [string]).optional(),
    
    commissionRate: z.number({ error: "commissionRate must be number" })
        .min(0, { message: "commissionRate must not be negative" }).optional()



})