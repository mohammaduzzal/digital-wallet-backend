import { model, Schema } from "mongoose";
import { IWallet } from "./wallet.interface";

const walletSchema = new Schema<IWallet>({
    owner : {
        type : Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    balance:{
        type:Number,
        default : 50
       
    },
    currency:{
        type:String,
        default : "BDT"
        
    },
    isBlocked :{
        type: Boolean,
        default:false
    }
},{
    timestamps:true,
    versionKey:false
})


export const Wallet = model<IWallet>("Wallet", walletSchema)