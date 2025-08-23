import z from "zod";

export const createContactValidation = z.object({
    firstName: z.string({ error: "name must be string" }).min(2, { message: "name is too short.minimum 2 character long" }).max(50, { message: "name is too long.maximum 50 character long" }),
    lastName: z.string({ error: "name must be string" }).min(2, { message: "name is too short.minimum 2 character long" }).max(50, { message: "name is too long.maximum 50 character long" }),
    subject: z.string({ error: "name must be string" }).min(2, { message: "name is too short.minimum 2 character long" }).max(50, { message: "name is too long.maximum 50 character long" }),
    message: z.string({ error: "name must be string" }).min(2, { message: "name is too short.minimum 2 character long" }).max(50, { message: "name is too long.maximum 50 character long" }),

    email: z.email({ error: "invalid email address format" })
        .min(5, { message: "email must be at least 5 characters long" })
        .max(100, { message: "email cannot exceed 100 characters" }),
})