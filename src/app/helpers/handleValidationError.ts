/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import { TErrorSource, TGenericErrorResponse } from "../interfaces/error.types";

export const handleValidationError =(err : mongoose.Error.ValidationError) :TGenericErrorResponse =>{
    const errorSource : TErrorSource[] = []

    const errors = Object.values(err.errors)

    errors.forEach((errorObject : any) =>errorSource.push({
        path : errorObject.path,
        message : errorObject.message
    }))


    return{
        statusCode : 400,
        message : "validation error",
        errorSource

    }
}