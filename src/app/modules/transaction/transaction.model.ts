import { model, Schema } from "mongoose";
import { IStatus, ITransaction, IType } from "./transaction.interface";

const transactionSchema = new Schema<ITransaction>({
    types: {
        type: String,
        enum: Object.values(IType),
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    fee: {
        type: Number,
        default: 0
    },
    commission:{
        type:Number,
        default:0
    },
    senderWallet:{
        type: Schema.Types.ObjectId,
        ref:"Wallet"
    },
    receiverWallet:{
        type:Schema.Types.ObjectId,
        ref:"Wallet"
    },
    initiateBy:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required : true
    },
    status:{
        type : String,
        enum : Object.values(IStatus),
        default : IStatus.COMPLETED,
        required : true
    },
    description: {
        type:String
    }
},
{
    timestamps :true,
    versionKey:false
})


export const Transaction = model<ITransaction>("Transaction", transactionSchema)