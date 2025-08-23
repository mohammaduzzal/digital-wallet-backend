import { IContact } from "./contact.interface";
import { Contact } from "./contact.model";

const createPost = async(payload : IContact)=>{

    const existingContact = await Contact.findOne({name : payload.email})

    if(existingContact){
        throw new Error("A contact with this email is already exist")
    }


    const contact = await Contact.create(payload);

    return contact



};


export const contactService = {
    createPost
}