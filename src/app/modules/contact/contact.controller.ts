/* eslint-disable @typescript-eslint/no-unused-vars */
import  httpStatus  from 'http-status-codes';
import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import { contactService } from './contact.service';

const createPost = catchAsync(async(req:Request, res:Response,next:NextFunction)=>{


    const contact = await contactService.createPost(req.body)


    sendResponse(res,{
        success : true,
        statusCode:httpStatus.CREATED,
        message : "posted  successfully",
        data : contact
    })
})


export const contactController = {
    createPost
}