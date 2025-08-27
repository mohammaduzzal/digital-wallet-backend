import httpStatus from 'http-status-codes';
import { JwtPayload } from "jsonwebtoken"
import { IStatus, ITransaction, IType } from "./transaction.interface"
import mongoose from "mongoose"
import { User } from "../user/user.model";
import AppError from "../../errorHelpers/AppError";
import { Wallet } from '../wallet/wallet.model';
import { Transaction } from './transaction.model';
import { validateUserWithWallet, validateWallet } from '../../utils/checkTransactionEligibility';
import { QueryBuilder } from '../../utils/queryBuilders';
import { transactionSearchableField } from './transaction.contants';
import { ISendMoneyPayload } from './transaction.interface.dto';




const deposit = async (payload: Partial<ISendMoneyPayload>, decodedToken: JwtPayload) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { amount, senderEmail } = payload;

        if (!amount || amount <= 0) {
            throw new AppError(400, "Invalid amount")
        }

        const agent = await User.findOne({ email: senderEmail }).session(session);


        if (!agent) {
            throw new AppError(404, "Agent not found")
        }

        const user = await validateUserWithWallet(decodedToken.userId, session);

        const userWalletId = user.wallet._id;


        await Wallet.findByIdAndUpdate(userWalletId,
            { $inc: { balance: amount } },
            { session });

        const transaction = new Transaction({
            types: IType.CASH_IN,
            amount,
            receiverWallet: userWalletId,
            initiateBy: agent._id, // simulate agent as initiator
            status: IStatus.COMPLETED,
            description: `Deposit of BDT ${amount} via agent ${agent.email}`,
        });

        const savedTransaction = await transaction.save({ session });
        await session.commitTransaction();
        session.endSession();

        return savedTransaction;

    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        throw err;
    }
};



const withdraw = async (payload: Partial<ITransaction>, decodedToken: JwtPayload) => {

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const amount = payload.amount

        if (!amount || amount <= 0) {
            throw new AppError(httpStatus.BAD_REQUEST, "A valid positive amount is required.");
        }

        const user = await validateUserWithWallet(decodedToken.userId, session)

        const walletId = user.wallet._id


        if (amount > user.wallet.balance) {
            throw new AppError(httpStatus.BAD_REQUEST, "insufficient balance")
        }

        const updateWallet = await Wallet.findByIdAndUpdate(
            walletId,
            { $inc: { balance: -amount } },
            { new: true, runValidators: true, session }
        )

        if (!updateWallet) {
            throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "failed to update wallet")
        }

        const newTransaction = new Transaction({
            types: IType.WITHDRAW,
            amount: amount,
            senderWallet: walletId,
            initiateBy: decodedToken.userId,
            status: IStatus.COMPLETED,
            description: payload.description || `withdraw of BDT ${amount} from your wallet.`
        })

        const savedTransaction = await newTransaction.save({ session })

        await session.commitTransaction()
        session.endSession()

        return savedTransaction



    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw error

    }



}



const sendMoney = async (payload: Partial<ISendMoneyPayload>, decodedToken: JwtPayload) => {
    //   console.log("sendMoney called"); 
    // console.log(payload)
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { amount } = payload
        if (!amount || amount <= 0) {
            throw new AppError(httpStatus.BAD_REQUEST, "A valid positive amount is required.");
        }

        // find receiver email
        const receiverUser = await User.findOne({ email: payload.receiverEmail }).session(session);


        if (!receiverUser) {
            throw new AppError(httpStatus.NOT_FOUND, "Receiver not found.");
        }

        const receiverWalletId = receiverUser.wallet;


        const senderUser = await validateUserWithWallet(decodedToken.userId, session)
        const senderWalletId = senderUser.wallet._id as mongoose.Types.ObjectId




        if (receiverWalletId?.toString() === senderWalletId.toString()) {
            throw new AppError(httpStatus.BAD_REQUEST, "You cannot send money to your own wallet.");
        }


        if (amount > senderUser.wallet.balance) {
            throw new AppError(httpStatus.BAD_REQUEST, "insufficient balance")
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const receiverWallet = await validateWallet(receiverWalletId as mongoose.Types.ObjectId, session)



        const updateSenderWalletPromise = Wallet.findByIdAndUpdate(
            senderWalletId,
            { $inc: { balance: -amount } },
            { new: true, runValidators: true, session }
        )



        const updateReceiverWalletPromise = Wallet.findByIdAndUpdate(
            receiverWalletId,
            { $inc: { balance: amount } },
            { new: true, runValidators: true, session }
        )

        const [updateSenderWallet, updateReceiverWallet] = await Promise.all([
            updateSenderWalletPromise,
            updateReceiverWalletPromise
        ])

        if (!updateSenderWallet || !updateReceiverWallet) {
            throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "failed to update wallet")
        }




        const newTransaction = new Transaction({
            types: IType.SEND,
            amount: amount,
            senderWallet: senderWalletId,
            receiverWallet: receiverWalletId,
            initiateBy: decodedToken.userId,
            status: IStatus.COMPLETED,
            description: payload.description || `sent money of BDT ${amount} from your wallet to ${receiverWalletId} account.`
        })

        const savedTransaction = await newTransaction.save({ session })

        await session.commitTransaction()
        session.endSession()

        return savedTransaction



    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw error

    }



}


const cashIn = async (payload: Partial<ISendMoneyPayload>, decodedToken: JwtPayload) => {

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const amount = payload.amount

        if (!amount || amount <= 0) {
            throw new AppError(httpStatus.BAD_REQUEST, "A valid positive amount is required.");
        }

        // find receiver email
        const receiverUser = await User.findOne({ email: payload.receiverEmail }).session(session);


        if (!receiverUser) {
            throw new AppError(httpStatus.NOT_FOUND, "Receiver not found.");
        }

        const receiverWalletId = receiverUser.wallet;

        const agent = await validateUserWithWallet(decodedToken.userId, session)


        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const receiverWallet = await validateWallet(receiverWalletId as mongoose.Types.ObjectId, session)



        const commissionRate = agent.commissionRate || 0
        const commissionAmount = (amount * commissionRate) / 100
        const amountToDebitFromAgent = amount - commissionAmount

        if (amountToDebitFromAgent > agent.wallet.balance) {
            throw new AppError(httpStatus.BAD_REQUEST, "insufficient balance")
        }



        const senderPromise = Wallet.findByIdAndUpdate(
            agent.wallet._id,
            { $inc: { balance: -amountToDebitFromAgent } },
            { new: true, runValidators: true, session }
        )


        const receiverPromise = Wallet.findByIdAndUpdate(
            receiverWalletId,
            { $inc: { balance: amount } },
            { new: true, runValidators: true, session }
        )

        const [updateSenderWallet, updateReceiverWallet] = await Promise.all([
            senderPromise,
            receiverPromise
        ])

        if (!updateSenderWallet || !updateReceiverWallet) {
            throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "failed to update wallet")
        }




        const newTransaction = new Transaction({
            types: IType.CASH_IN,
            amount: amount,
            fee: 0,
            commission: commissionAmount,
            senderWallet: agent.wallet._id,
            receiverWallet: receiverWalletId,
            initiateBy: decodedToken.userId,
            status: IStatus.COMPLETED,
            description: payload.description || `Cash-In of BDT ${amount} to user account. Commission: BDT ${commissionAmount}.`
        })

        const savedTransaction = await newTransaction.save({ session })

        await session.commitTransaction()
        session.endSession()

        return savedTransaction



    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw error

    }



}



const cashOut = async (payload: Partial<ISendMoneyPayload>, decodedToken: JwtPayload) => {

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const amount = payload.amount
        // const userWalletId = payload.senderWallet



        if (!amount || amount <= 0) {
            throw new AppError(httpStatus.BAD_REQUEST, "A valid positive amount is required.");
        }


        // find receiver email
        const senderUser = await User.findOne({ email: payload.senderEmail }).session(session);


        if (!senderUser) {
            throw new AppError(httpStatus.NOT_FOUND, "Receiver not found.");
        }

        const senderWalletId = senderUser.wallet;

        const agent = await validateUserWithWallet(decodedToken.userId, session)




        const userWallet = await validateWallet(senderWalletId as mongoose.Types.ObjectId, session)



        const commissionRate = agent.commissionRate || 0
        const commissionAmount = (amount * commissionRate) / 100
        const amountToCreditFromAgent = amount - commissionAmount

        if (amount > userWallet.balance) {
            throw new AppError(httpStatus.BAD_REQUEST, "insufficient balance")
        }



        const userPromise = Wallet.findByIdAndUpdate(
            senderWalletId,
            { $inc: { balance: -amount } },
            { new: true, runValidators: true, session }
        )


        const agentPromise = Wallet.findByIdAndUpdate(
            agent.wallet._id,
            { $inc: { balance: amountToCreditFromAgent } },
            { new: true, runValidators: true, session }
        )

        const [updateUserWallet, updateAgentWallet] = await Promise.all([
            userPromise,
            agentPromise
        ])

        if (!updateUserWallet || !updateAgentWallet) {
            throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "failed to update wallet")
        }




        const newTransaction = new Transaction({
            types: IType.CASH_OUT,
            amount: amount,
            fee: commissionAmount,
            commission: commissionAmount,
            senderWallet: senderWalletId,
            receiverWallet: agent.wallet._id,
            initiateBy: decodedToken.userId,
            status: IStatus.COMPLETED,
            description: payload.description || `Cash-out of BDT ${amount} to user account. Commission: BDT ${commissionAmount}.`
        })

        const savedTransaction = await newTransaction.save({ session })

        await session.commitTransaction()
        session.endSession()

        return savedTransaction



    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw error

    }



}






const getAllTransactions = async (query: Record<string, string>) => {

    const queryBuilder = new QueryBuilder(Transaction.find(), query)

    const transactionData = queryBuilder
        .filter()
        .search(transactionSearchableField)
        .sort()
        .fields()
        .pagination()

    const [data, meta] = await Promise.all([
        transactionData.build(),
        queryBuilder.getMeta()
    ])

    return {
        data,
        meta
    }
}


const getMyTransactions = async (userId: string, query: Record<string, string>) => {

    const user = await User.findById(userId).select("wallet")

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User or wallet not found.");
    }

    const walletId = user.wallet

    const baseQuery = Transaction.find({
        $or: [

            { initiateBy: userId },
            { senderWallet: walletId },
            { receiverWallet: walletId }

        ]
    }).sort({ createdAt: -1 })
        .populate("senderWallet", "owner balance")
        .populate("receiverWallet", "owner balance")


    const queryBuilder = new QueryBuilder(baseQuery, query)

    const transactionData = queryBuilder
        .filter()
        .sort()
        .fields()
        .pagination()

    const [data, meta] = await Promise.all([
        transactionData.build(),
        queryBuilder.getMeta()
    ])

    return {
        data,
        meta
    }




}





export const TransactionService = {
    deposit,
    withdraw,
    sendMoney,
    cashIn,
    cashOut,
    getAllTransactions,
    getMyTransactions
}