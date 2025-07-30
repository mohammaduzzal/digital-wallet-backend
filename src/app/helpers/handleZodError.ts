/* eslint-disable @typescript-eslint/no-explicit-any */
import { TErrorSource, TGenericErrorResponse } from "../interfaces/error.types";

export const handleZodError =(err : any) :TGenericErrorResponse=>{
    const errorSource : TErrorSource[] =[]

    err.issues.forEach((issue : any)=>{
        errorSource.push({
            path : issue.path.length > 1 && issue.path.reverse().join(" inside "),
            message : issue.message
        })
    })


    return{
        statusCode : 400,
        message : "zod error",
        errorSource
    }
}