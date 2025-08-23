import { model, Schema } from "mongoose";
import { IContact } from "./contact.interface";

const contactSchema = new Schema<IContact>({
    firstName : {
        type : String,
        required :true
    },
    lastName : {
        type : String,
        required :true
    },
    email : {
        type : String,
        required :true
    },
    subject : {
        type : String,
        required :true
    },
    message : {
        type : String,
        required :true
    },
})


export const Contact = model<IContact>("Contact", contactSchema)