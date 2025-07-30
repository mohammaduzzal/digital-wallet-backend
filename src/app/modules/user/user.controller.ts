/* eslint-disable @typescript-eslint/no-unused-vars */
import  httpStatus  from 'http-status-codes';
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { UserService } from './user.service';

const createUser = catchAsync(async(req:Request, res:Response,next:NextFunction)=>{


    const user = await UserService.createUser(req.body)


    sendResponse(res,{
        success : true,
        statusCode:httpStatus.CREATED,
        message : "user created successfully",
        data : user
    })
})


const getAllUser = catchAsync(async(req:Request, res:Response,next:NextFunction)=>{

    const result = await UserService.getAllUser()

    sendResponse(res,{
        success : true,
        statusCode:httpStatus.OK,
        message : "all user retrieved successfully",
        data : result.data,
        meta : result.meta
    })
})



const updateUser = catchAsync(async(req:Request, res:Response,next:NextFunction)=>{

    const userId = req.params.id;
    const payload = req.body;


    const result = await UserService.updateUser(userId,payload)

    sendResponse(res,{
        success : true,
        statusCode:httpStatus.OK,
        message : "user updated successfully",
        data : result
       
    })
})



export const UserController ={
    createUser,
    getAllUser,
    updateUser
}