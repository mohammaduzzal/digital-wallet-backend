/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { WalletService } from "./wallet.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status-codes';

const getAllWallets = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query
    const result = await WalletService.getAllWallets(query as Record<string,string>)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "all user wallet retrieved successfully",
        data: result.data,
        meta: result.meta
    })
})


const getMyWallet = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const decodedToken = req.user;

    const result = await WalletService.getMyWallet(decodedToken)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "your wallet retrieved successfully",
        data: result.data,

    })
})



const getSingleWallet = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id

    const result = await WalletService.getSingleWallet(id)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "wallet retrieved successfully",
        data: result.data

    })
})


const updateWallet = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    const payload = req.body

    const result = await WalletService.updateWallet(id,payload)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "wallet updated successfully",
        data: result

    })
})


export const WalletController = {
    getAllWallets,
    getMyWallet,
    getSingleWallet,
    updateWallet
}