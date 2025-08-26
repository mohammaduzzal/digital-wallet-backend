/* eslint-disable @typescript-eslint/no-unused-vars */
import  httpStatus  from 'http-status-codes';
import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import { statsService } from './stats.service';

const getUserStats = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const result = await statsService.getUserStats()

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "users stats retrieved successful",
        data: result
    })
})


const getTransactionStats = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const result = await statsService.getTransactionStats()

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "transaction stats retrieved successful",
        data: result
    })
})


export const statsController = {
    getUserStats,
    getTransactionStats

}