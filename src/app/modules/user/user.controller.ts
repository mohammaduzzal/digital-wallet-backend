/* eslint-disable @typescript-eslint/no-unused-vars */
import  httpStatus  from 'http-status-codes';
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { UserService } from './user.service';
import { JwtPayload } from 'jsonwebtoken';

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
    const query = req.query
    const result = await UserService.getAllUser(query as Record<string,string>)

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
    const  verifiedToken = req.user;


    const result = await UserService.updateUser(userId,payload,verifiedToken as JwtPayload)

    sendResponse(res,{
        success : true,
        statusCode:httpStatus.OK,
        message : "user updated successfully",
        data : result
       
    })
})

const getMe = catchAsync(async(req:Request, res:Response,next:NextFunction)=>{
  const decodedToken = req.user as JwtPayload;
  const result = await UserService.getMe(decodedToken.userId)

  sendResponse(res,{
    success : true,
    statusCode: httpStatus.OK,
    message:"Your profile retrieve successfully",
    data:result.data
   })
})

const  getSingleUser = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
  const id = req.params.id
  const result = await UserService.getSingleUser(id)

  sendResponse(res,{
    success:true,
    statusCode:httpStatus.CREATED,
    message:"user retrieved successfully",
    data : result.data
  })
})




export const UserController ={
    createUser,
    getAllUser,
    updateUser,
    getMe,
    getSingleUser
}