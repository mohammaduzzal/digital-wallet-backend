import  httpStatus  from 'http-status-codes';
import { JwtPayload } from "jsonwebtoken"
import { IStatus, ITransaction, IType } from "./transaction.interface"
import mongoose from "mongoose"
import { User } from "../user/user.model";
import AppError from "../../errorHelpers/AppError";
import { IUser } from '../user/user.interface';
import { IWallet } from '../wallet/wallet.interface';
import { Wallet } from '../wallet/wallet.model';
import { Transaction } from './transaction.model';


type PopulateUser = Omit<IUser, "wallet"> &{
    wallet : IWallet
}

const deposit = async(payload : Partial<ITransaction>, decodedToken : JwtPayload)=>{

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const user = await User.findById(decodedToken.userId).populate<PopulateUser>("wallet").session(session)

        if(!user || !user.wallet){
            throw new AppError(httpStatus.NOT_FOUND, "user or wallet not found")
        }

           if(user.wallet.isBlocked){
            throw new AppError(httpStatus.FORBIDDEN, "Your wallet is currently blocked and cannot perform any operations.")
        }


        if(!user.isApproved){
            throw new AppError(httpStatus.FORBIDDEN, "your account is not approved")
        }


        const walletId = user.wallet._id
        const amount = payload.amount

        const updateWallet = await Wallet.findByIdAndUpdate(
            walletId,
            {$inc : {balance : amount}},
            {new:true, runValidators : true}
        )

        if(!updateWallet){
            throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "failed to update wallet")
        }

        const newTransaction = new Transaction({
            types : IType.DEPOSIT,
            amount : amount,
            receiverWallet : walletId,
            initiateBy : decodedToken.userId,
            status : IStatus.COMPLETED,
            description: payload.description || `deposit of BDT ${amount} to wallet.`
        })

        const savedTransaction = await newTransaction.save({session})

        await session.commitTransaction()
        session.endSession()

        return savedTransaction

     
        
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
       throw error
        
    }


    
}


const withdraw = async(payload : Partial<ITransaction>, decodedToken : JwtPayload)=>{

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const amount = payload.amount

        if(!amount || amount <= 0){
              throw new AppError(httpStatus.BAD_REQUEST, "A valid positive amount is required.");
        }


        const user = await User.findById(decodedToken.userId).populate<PopulateUser>("wallet").session(session)

        if(!user || !user.wallet){
            throw new AppError(httpStatus.NOT_FOUND, "user or wallet not found")
        }

           if(user.wallet.isBlocked){
            throw new AppError(httpStatus.FORBIDDEN, "Your wallet is currently blocked and cannot perform any operations.")
        }


        if(!user.isApproved){
            throw new AppError(httpStatus.FORBIDDEN, "your account is not approved")
        }


        const walletId = user.wallet._id
        

        if(amount > user.wallet.balance){
            throw new AppError(httpStatus.BAD_REQUEST, "insufficient balance")
        }

        const updateWallet = await Wallet.findByIdAndUpdate(
            walletId,
            {$inc : {balance : -amount}},
            {new:true, runValidators : true}
        )

        if(!updateWallet){
            throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "failed to update wallet")
        }

        const newTransaction = new Transaction({
            types : IType.WITHDRAW,
            amount : amount,
            senderWallet : walletId,
            initiateBy : decodedToken.userId,
            status : IStatus.COMPLETED,
            description: payload.description || `withdraw of BDT ${amount} from your wallet.`
        })

        const savedTransaction = await newTransaction.save({session})

        await session.commitTransaction()
        session.endSession()

        return savedTransaction

     
        
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
       throw error
        
    }


    
}



const sendMoney = async(payload : Partial<ITransaction>, decodedToken : JwtPayload)=>{

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const amount = payload.amount
        const receiverWalletId = payload.receiverWallet
       


        if(!amount || amount <= 0){
              throw new AppError(httpStatus.BAD_REQUEST, "A valid positive amount is required.");
        }


        const user = await User.findById(decodedToken.userId).populate<PopulateUser>("wallet").session(session)

        if(!user || !user.wallet){
            throw new AppError(httpStatus.NOT_FOUND, "user or wallet not found")
        }

           if(user.wallet.isBlocked){
            throw new AppError(httpStatus.FORBIDDEN, "Your wallet is currently blocked and cannot perform any operations.")
        }


        if(!user.isApproved){
            throw new AppError(httpStatus.FORBIDDEN, "your account is not approved")
        }


        const senderWalletId = user.wallet._id
        

        if(amount > user.wallet.balance){
            throw new AppError(httpStatus.BAD_REQUEST, "insufficient balance")
        }

        const receiverWallet = await Wallet.findById(receiverWalletId).session(session)
      

        if(!receiverWallet){
            throw new AppError(httpStatus.NOT_FOUND, "receiver's wallet not found")
        }
        if(receiverWallet.isBlocked){
            throw new AppError(httpStatus.BAD_REQUEST, "Receiver's wallet is currently blocked and cannot receive money.")
        }



        const updateSenderWallet = await Wallet.findByIdAndUpdate(
            senderWalletId,
            {$inc : {balance : -amount}},
            {new:true, runValidators : true}
        )

        if(!updateSenderWallet){
            throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "failed to update wallet")
        }

        const updateReceiverWallet = await Wallet.findByIdAndUpdate(
            receiverWalletId,
            {$inc : {balance : amount}},
            {new:true, runValidators : true}
        )

        if(!updateReceiverWallet){
            throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "failed to update wallet")
        }




        const newTransaction = new Transaction({
            types : IType.SEND,
            amount : amount,
            senderWallet : senderWalletId,
            receiverWallet : receiverWalletId,
            initiateBy : decodedToken.userId,
            status : IStatus.COMPLETED,
            description: payload.description || `sent money of BDT ${amount} from your wallet to ${receiverWalletId} account.`
        })

        const savedTransaction = await newTransaction.save({session})

        await session.commitTransaction()
        session.endSession()

        return savedTransaction

     
        
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
       throw error
        
    }


    
}



const getAllTransactions = async () => {

    const transactions = await Transaction.find({});

    const totalTransactions = await Transaction.countDocuments()


    return {
        data: transactions,
        meta: {
            total: totalTransactions
        }
    }
}


const getMyTransactions = async (userId : string) => {

    const user = await User.findById(userId).select("wallet")

    if(!user){
        throw new AppError(httpStatus.NOT_FOUND, "User or wallet not found.");
    }

    const walletId = user.wallet

    const transactions = await Transaction.find({
        $or:[
            
                {initiateBy: userId},
                {senderWallet: walletId},
                {receiverWallet:walletId}
            
        ]
    }).sort({createdAt : -1})
    .populate("senderWallet", "owner balance")
    .populate("receiverWallet", "owner balance")

    return transactions
}





export const TransactionService = {
    deposit,
    withdraw,
    sendMoney,
    getAllTransactions,
    getMyTransactions
}