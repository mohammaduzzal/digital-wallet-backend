/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from 'http-status-codes';
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { TransactionService } from './transaction.service';
import { JwtPayload } from 'jsonwebtoken';

const deposit = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user
    const result = await TransactionService.deposit(req.body, decodedToken as JwtPayload)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Deposit successful.",
        data: result
    })
})


const withdraw = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user
    const result = await TransactionService.withdraw(req.body, decodedToken as JwtPayload)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "withdraw successful.",
        data: result
    })
})



const sendMoney = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user
    const result = await TransactionService.sendMoney(req.body, decodedToken as JwtPayload)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "send money successful.",
        data: result
    })
})



const cashIn = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user
    const result = await TransactionService.cashIn(req.body, decodedToken as JwtPayload)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "cash in successful.",
        data: result
    })
})


const cashOut = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user
    const result = await TransactionService.cashOut(req.body, decodedToken as JwtPayload)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "cash out successful.",
        data: result
    })
})




const getAllTransactions = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query
    const result = await TransactionService.getAllTransactions(query as Record<string,string>)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "all transactions retrieved successful.",
        data: result.data,
        meta: result.meta
    })
})



const getMyTransactions = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload

    const result = await TransactionService.getMyTransactions(decodedToken.userId)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "your transactions retrieved successful.",
        data: result

    })
})






export const TransactionController = {
    deposit,
    withdraw,
    sendMoney,
    cashIn,
    cashOut,
    getAllTransactions,
    getMyTransactions
}