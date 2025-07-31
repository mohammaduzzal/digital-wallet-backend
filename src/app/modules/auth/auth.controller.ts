/* eslint-disable @typescript-eslint/no-unused-vars */
import  httpStatus  from 'http-status-codes';
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AuthServices } from './auth.service';
import AppError from '../../errorHelpers/AppError';
import { setAuthCookie } from '../../utils/setCookies';
import { JwtPayload } from 'jsonwebtoken';

const credentialsLogin =catchAsync(async(req:Request,res:Response,next:NextFunction)=>{

    const loginInfo = await AuthServices.credentialsLogin(req.body)

    
   setAuthCookie(res,loginInfo)

    sendResponse(res,{
        statusCode : httpStatus.OK,
        success:true,
        message : "login successful",
        data :loginInfo
    })
})


const getNewAccessToken =catchAsync(async(req:Request,res:Response,next:NextFunction)=>{

    const refreshToken = req.cookies.refreshToken

    if(!refreshToken){
        throw new AppError(httpStatus.BAD_REQUEST, "no refreshToken received from cookies")
    }


   const tokenInfo =await AuthServices.getNewAccessToken(refreshToken)

  setAuthCookie(res,tokenInfo)


    sendResponse(res,{
        statusCode : httpStatus.OK,
        success:true,
        message : "new access token retrieved successfully",
        data :tokenInfo
    })
})


const logout =catchAsync(async(req:Request,res:Response,next:NextFunction)=>{

   res.clearCookie("accessToken",{
    httpOnly:true,
    secure:false,
    sameSite:"lax"
   })
   res.clearCookie("refreshToken",{
    httpOnly:true,
    secure:false,
    sameSite:"lax"
   })

    sendResponse(res,{
        statusCode : httpStatus.OK,
        success:true,
        message : "logout successful",
        data :null
    })
})


const resetPassword =catchAsync(async(req:Request,res:Response,next:NextFunction)=>{

  const decodedToken = req.user;
  const oldPassword = req.body.oldPassword
  const newPassword = req.body.newPassword;

  await AuthServices.resetPassword(oldPassword,newPassword, decodedToken as JwtPayload)

    sendResponse(res,{
        statusCode : httpStatus.OK,
        success:true,
        message : "password changed successfully",
        data :null
    })
})




export const AuthController ={
    credentialsLogin,
    getNewAccessToken,
    logout,
    resetPassword
}