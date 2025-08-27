import { IType } from "./transaction.interface";

export interface ISendMoneyPayload {
  types: IType;             
  amount: number;           
  receiverEmail?: string;    
  description?: string;
  senderEmail?:string     
}