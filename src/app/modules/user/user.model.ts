import { model, Schema } from "mongoose";
import { IAuthProvider, IUser, Role } from "./user.interface";


const authProviderSchema = new Schema<IAuthProvider>({
    provider:{
        type:String,
        required:true
    },
    providerId:{
        type:String,
        required:true
    }
},{
    versionKey:false,
    _id:false
})





const userSchema = new Schema<IUser>({
    name :{
        type : String,
        required :true
    },
    email:{
        type:String,
        required :true
    },
    password :{
        type : String
    },
    role:{
        type:String,
        enum: Object.values(Role),
    },
    phoneNumber:{
        type:String
    },
    wallet:{
        type:Schema.Types.ObjectId,
        ref : "Wallet",
       
    },
    isApproved:{
        type:Boolean,
        default:true
    },
    commissionRate :{
        type:Number,
        default:0
    },
    auths: [authProviderSchema]
},{
    timestamps:true,
    versionKey:false
})


export const User = model<IUser>("User", userSchema)