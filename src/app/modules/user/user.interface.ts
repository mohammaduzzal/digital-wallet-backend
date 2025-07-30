import { Types } from "mongoose";

export enum Role{
    USER="USER",
    AGENT="AGENT",
    ADMIN="ADMIN"
}

export interface IAuthProvider{
    provider : "credentials" | "google";
    providerId : string;
}

export interface IUser{
    _id?: Types.ObjectId;
    name:string;
    email : string;
    phoneNumber?:string;
    password?:string;
    wallet: Types.ObjectId;
    isApproved ?: boolean;
    role : Role;
    commissionRate?:number;
    auths : IAuthProvider[];
}