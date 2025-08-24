import { Types } from "mongoose";

export enum IType{
    DEPOSIT="DEPOSIT",
    WITHDRAW="WITHDRAW",
    SEND="SEND",
    RECEIVE="RECEIVE",
    CASH_IN="CASH_IN",
    CASH_OUT="CASH_OUT",
}

export enum IStatus{
    COMPLETED="COMPLETED",
    PENDING="PENDING",
    FAILED="FAILED",
    REVERSED="REVERSED"
}


export interface ITransaction{
    _id?: Types.ObjectId;
    types : IType;
    amount : number;
    fee ?: number;
    commission?:number;
    senderWallet : Types.ObjectId;
    receiverWallet : Types.ObjectId;
    initiateBy : Types.ObjectId;
    status : IStatus;
    description?:string;
}