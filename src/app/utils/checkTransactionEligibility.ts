import httpStatus from 'http-status-codes';
import AppError from '../errorHelpers/AppError';
import { User } from '../modules/user/user.model';
import { IWallet } from '../modules/wallet/wallet.interface';
import { IUser } from './../modules/user/user.interface';
import mongoose from "mongoose";
import { Wallet } from '../modules/wallet/wallet.model';

type PopulateUser = Omit<IUser, "wallet"> & { wallet: IWallet }

export const validateUserWithWallet = async (userId: string, session: mongoose.ClientSession) => {
    const user = await User.findById(userId).populate<PopulateUser>("wallet").session(session)

    if (!user || !user.wallet) {
        throw new AppError(httpStatus.NOT_FOUND, "user or wallet not found")
    }

    if (!user.isApproved) {
        throw new AppError(httpStatus.FORBIDDEN, "Your are  not approved and cannot perform any operations.")
    }
    if (user.wallet.isBlocked) {
        throw new AppError(httpStatus.FORBIDDEN, "Your wallet is currently blocked and cannot perform any operations.")
    }


    if (!user.isApproved) {
        throw new AppError(httpStatus.FORBIDDEN, "your account is not approved")
    }

    return user

}



export const validateWallet = async (walletId: string | mongoose.Types.ObjectId, session: mongoose.ClientSession) => {
    const receiverWallet = await Wallet.findById(walletId).session(session)


    if (!receiverWallet) {
        throw new AppError(httpStatus.NOT_FOUND, "receiver's wallet not found")
    }
    if (receiverWallet.isBlocked) {
        throw new AppError(httpStatus.BAD_REQUEST, "Receiver's wallet is currently blocked and cannot receive money.")
    }

    return receiverWallet
}


export const validateAmount = (amount: number) => {
    if (!amount || amount <= 0) {
        throw new AppError(httpStatus.BAD_REQUEST, "A valid positive amount is required.");
    }
}