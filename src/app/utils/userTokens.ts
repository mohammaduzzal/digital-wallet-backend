import  httpStatus  from 'http-status-codes';
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";
import { IUser } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import { generateToken, verifyToken } from "./jwt";
import { JwtPayload } from 'jsonwebtoken';

export const createUserToken = (user: Partial<IUser>) => {

    const jwtPayload = {
        userId: user._id,
        email: user.email,
        role: user.role
    }

    const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES)

    const refreshToken = generateToken(jwtPayload, envVars.JWT_REFRESH_SECRET, envVars.JWT_REFRESH_EXPIRE)

    return {
        accessToken,
        refreshToken
    }
}


export const createNewAccessTokenWithRefreshToken = async(refreshToken :string) => {
    const verifiedRefreshToken = verifyToken(refreshToken, envVars.JWT_REFRESH_SECRET) as JwtPayload


    const isUserExist = await User.findOne({ email: verifiedRefreshToken.email })

    if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "user does not exist")
    }


    const jwtPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role
    }

    const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES)

    return accessToken
}