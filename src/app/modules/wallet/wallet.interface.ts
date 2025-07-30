import { Types } from "mongoose";

export interface IWallet{
    _id ?: Types.ObjectId;
    owner : Types.ObjectId;
    balance : number;
    currency : string;
    isBlocked : boolean;
}