import httpStatus from 'http-status-codes';
import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import bcryptjs from "bcryptjs"
import { envVars } from '../../config/env';
import { Wallet } from '../wallet/wallet.model';
import mongoose from 'mongoose';
import { IWallet } from '../wallet/wallet.interface';
import { JwtPayload } from 'jsonwebtoken';

const createUser = async (payload: Partial<IUser>) => {

    const { email, password, ...rest } = payload

    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const isUserExist = await User.findOne({ email }).session(session)

        if (isUserExist) {
            throw new AppError(httpStatus.BAD_REQUEST, "user already exist")
        }

        const hashPassword = await bcryptjs.hash(password as string, Number(envVars.BCRYPTJS_SALT_ROUND))

        const authProvider: IAuthProvider = {
            provider: "credentials",
            providerId: email as string
        }

        const isAgent = rest.role === Role.AGENT;
        const initialIsApproved = isAgent ? false : true;
        const initialCommissionRate = isAgent ? 0 : undefined;


        const newUser = new User({
            email,
            password: hashPassword,
            auths: [authProvider],
            isApproved: initialIsApproved,
            commissionRate: initialCommissionRate,
            ...rest
        })

        const saveUser = await newUser.save({ session })

        if (!saveUser) {
            throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to create user during registration.")
        }

        const newWalletData: IWallet = {
            owner: saveUser._id,
            balance: 50,
            currency: "BDT",
            isBlocked: false
        }


        const newWallet = new Wallet(newWalletData)

        const savedWallet = await newWallet.save({ session })

        if (!savedWallet) {
            throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to create wallet during registration.');
        }

        saveUser.wallet = savedWallet._id
        await saveUser.save({ session })

        await session.commitTransaction();
        session.endSession()


        return saveUser.toObject() as IUser



    } catch (error) {
        await session.abortTransaction()
        session.endSession()

        throw error

    }



}


const getAllUser = async () => {

    const users = await User.find({});

    const totalUser = await User.countDocuments()


    return {
        data: users,
        meta: {
            total: totalUser
        }
    }
}

const updateUser = async (userId: string, payload: Partial<IUser>, decodedToken: JwtPayload) => {
    const isUserExist = await User.findById(userId)
    if (!isUserExist) {
        throw new AppError(httpStatus.NOT_FOUND, "user not found")
    }

    if (payload.role) {
        if (decodedToken.role === Role.USER || decodedToken.role === Role.AGENT) {
            throw new AppError(httpStatus.FORBIDDEN, "you are not authorized")
        }
     
    }

        if (payload.isApproved !== undefined) {
        if (decodedToken.role === Role.USER || decodedToken.role === Role.AGENT) {
            throw new AppError(httpStatus.FORBIDDEN, "you are not authorized")
        }
    }

   

    if (payload.password) {
        payload.password = await bcryptjs.hash(payload.password, Number(envVars.BCRYPTJS_SALT_ROUND))
    }

    const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true })

    return newUpdatedUser

}


export const UserService = {
    createUser,
    getAllUser,
    updateUser
}